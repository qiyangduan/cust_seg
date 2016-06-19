import pandas as pd
import json

channel_dict = {
    1:'store_visit',
    2:'phone_call',
    3:'web_call',
    4:'app',
    5:'web_chat',
    6:'facebook',
    7:'twitter',
    8:'others',
    20:'buy',
    21:'not_buy',
}

# devide customer id and the path and build the key-value as (cust_id, 'path').  
# input:= calc_path('1049  : 1 5 6 6 21')
# result:=   ('store_visit:0,web_chat:1,facebook:2,facebook:3,not_buy', (1, '1049'))
def devide_cust_id_path(z):
    aa=z.split(':')
    # customer_id = int(aa[0].strip())
    return (int(aa[0].strip()),aa[1])

#devide_cust_id_path('1049  : 1 5 6 6 21')
#output: (1049, ' 1 5 6 6 21')

# decode the path and build the key-value as (path, (1, customer_id)). 1 will be used for later summary.
def build_path2cust_list(z):
    aa=z  #.split(':')
    customer_id = str(aa[0])
    x=aa[1].split()
    y=''
    for i in range(len(x)-1):
        ch_id = int(x[i]) 
        y = y + channel_dict[ch_id]+':'+str(i) + "," 
        
    y = y + channel_dict[int(x[len(x)-1]) ]
    return (y,(1,customer_id))

# build_path2cust_list((1049, ' 1 5 6 6 21'))
# output: = ('store_visit:0,web_chat:1,facebook:2,facebook:3,not_buy', (1, '1049'))

# decode the path and build the key-value as (path, (1, customer_id)). 1 will be used for later summary.
def build_path2cust_list_with_sentiment(z):
    aa=z  #.split(':')
    customer_id = str(aa[0])
    x=aa[1][0].split()
    y=''
    for i in range(len(x)-1):
        ch_id = int(x[i]) 
        y = y + channel_dict[ch_id]+':'+str(i) + "," 
        
    y = y + channel_dict[int(x[len(x)-1]) ]
    return (y,(1,customer_id))

# build_path2cust_list_with_sentiment((520, (' 2 2 2 2 21 ', 3.0)))
# output: = ('phone_call:0,phone_call:1,phone_call:2,phone_call:3,not_buy', (1, '520'))

# reduce the value of (1, customer_id) into (summary of int, list of customer)
def reduce_jouney_count_concat(x,y): 
    return (x[0]+y[0],'{},{}'.format(x[1],y[1])) #,'testing'




def flatmap_jouney(z):
    y=[]
    x=z[1][0].split(',')
    for i in range(len(x)- 1):
        # print('{}-->{},1'.format(x[i],x[i+1],1))
        y.append('{},{}={}'.format(x[i],x[i+1],z[0]))
    return y
#a = flatmap_jouney((5, ('facebook:0,no_buy:99', '9,20,21,25,30')))
#['facebook:0,no_buy:99=5']

def split_map_journey(x):
    z=x.split('=')
    return (z[0],int(z[1]))
# split_map_journey('facebook:0,no_buy:99=5')
# ('facebook:0,no_buy:99', 5)

def flatmap_jouney_nodes(z):
    y=[]
    x=z[1][0].split(',')
    for i in range(len(x)):
        # print('{}-->{},1'.format(x[i],x[i+1],1))
        y.append('{}'.format(x[i]))
    return y


def jouney_covered_check(nodelist, journey):
    jnodes = journey.split(',')
    for anode in jnodes:
        if not anode in nodelist:
            return False
    return True
# jouney_covered_check({"store_visit:0":"y","store_visit:1":"y","store_visit:2":"y","buy:99":"y"}.keys(), 'web_call:0,app:1,web_chat:2,no_buy:99') 

def collect_customer_from_journey(selected_journey_df):
    selected_id = []
    for index, row in selected_journey_df.iterrows(): 
        selected_id.extend(str(row['visitor_list']).split(','))
    return list(set(selected_id))


def build_journey_with_customer_filter(lines_nonempty,cust_list_rdd):
    # wordcounts is a temporary variable, for mapping original path to key-value (path, (1, cust_id)) 
    if cust_list_rdd is None: 
        wordcounts = lines_nonempty.map(lambda x:devide_cust_id_path(x)).map(lambda x:build_path2cust_list(x))
    else:
        wordcounts = lines_nonempty.map(lambda x:devide_cust_id_path(x)).join(cust_list_rdd)\
                    .map(lambda x:build_path2cust_list_with_sentiment(x))
    
    journey_rdd = wordcounts.reduceByKey(lambda x,y:reduce_jouney_count_concat(x,y))\
                 .map(lambda x:(x[1][0],(x[0],x[1][1]))).sortByKey(False)
    #print(journey_rdd.count())
    #wordcounts.take(1)

    return journey_rdd # ,sankey_links, sankey_nodes


# s1 = sqlContext.sql("SELECT * FROM journey_table WHERE visitor_count >= 600")
def create_sankey_json(journey_rdd, NUMBER_OF_NODES):
    # Create sankey json according to the journey. The the sankey_dict will be sent to front end for presentation.
    sankey_links = journey_rdd.flatMap(flatmap_jouney).map(split_map_journey).reduceByKey(lambda x,y:x+y).map(lambda x:(x[1],x[0])).sortByKey(False)
    #print(sankey_links.count())
    # sankey_links.take(25)

    sankey_nodes = journey_rdd.flatMap(flatmap_jouney_nodes).map(lambda x: (x, 1)).reduceByKey(lambda x,y:x+y).map(lambda x:(x[1],x[0])).sortByKey(False)
    #print(sankey_nodes.count())
    # sankey_nodes.collect()
    
    a = sankey_nodes.take(NUMBER_OF_NODES)
    node_dict = {}
    mynodes = []
    for i in range(len(a)):
        node_dict[a[i][1]] = i
        mynodes.append({"name":a[i][1]})

    ll = sankey_links.collect()
    mylinks = []
    # {"source":0,"target":1,"value":2}
    for i in range(len(ll)):
        if (ll[i][1].split(',')[0]  in node_dict.keys() and ll[i][1].split(',')[1]  in node_dict.keys()  ):
            source_node = node_dict[ ll[i][1].split(',')[0]  ] 
            target_node = node_dict[ ll[i][1].split(',')[1]  ] 
            mylinks.append({"source":source_node,"target":target_node,"value":ll[i][0]})
    sankey_dict = {"nodes":mynodes,
              "links":mylinks}
    return sankey_dict


def selected_cust_sankey_json(lines_nonempty, selected_cust_df,NUMBER_OF_NODES=10, sc=None):
    if selected_cust_df is None:
        cust_list_rdd = None
    else:
        cust_list = [tuple(x) for x in selected_cust_df[['cust_id','cust_id']].values]
        cust_list_rdd = sc.parallelize(cust_list)
    new_journey_rdd = build_journey_with_customer_filter(lines_nonempty,cust_list_rdd) # ,new_sankey_links, new_sankey_nodes
    new_sankey_json = create_sankey_json(new_journey_rdd, NUMBER_OF_NODES)
    return json.dumps(new_sankey_json)

