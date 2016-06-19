console.log("duan test custom");

require.config({
  paths: {
      d3: '/custom/d3sankey/js/d3',
      sankey: '/custom/d3sankey/js/sankey',
      nvd3: '/custom/nvd3/nv.d3',
  },
  shim: {
    'sankey': { deps:  ['d3']},
    'nvd3': { deps:  ['d3']}, 
  },
});

// ************
// Pie Chart

requirejs.undef('nvd3pie');

define('nvd3pie', ["jupyter-js-widgets"], function(widgets) {

    var pie_selected = {}
    var pie_color = {}
    var spinner_history = 'begin: ';
    
    var NVD3PieView = widgets.DOMWidgetView.extend({
        render: function() {

            var that = this;
            
            //var svg = d3.select(that.$el[0]).append("svg")
            
            //this.$input = $('<div id="piechart"><svg style="width:400px;height:400px;"></svg></div>');
            //this.$el.append(this.$input);

            //console.log('new_json_data -2 = ' + this.model.get('json_data'))
            this.json_data_changed();
            this.model.on('change:json_data', this.json_data_changed, this);
        },

        json_data_changed: function() {
            
          var that = this;
          var data_piechart = JSON.parse(this.model.get('json_data'));
          console.log('started drawing for json(changed): ' + data_piechart );

          
          require(['d3','nvd3' ],function(d3,nv) {
              console.log('started for json in requirejs.' + JSON.stringify(data_piechart));
              console.log(nv);
              
              nv.addGraph(function() {
                console.log('started addGraph');
                var chart = nv.models.pieChart();
                chart.margin({top: 20, right: 20, bottom: 20, left: 20});
                var datum = data_piechart[0].values;


                chart.color(d3.scale.category20c().range());
                chart.showLabels(true);
                chart.donut(false);
                chart.showLegend(true);
                chart
                    .x(function(d) { return d.label })
                    .y(function(d) { return d.value });

                chart.width(300);
                chart.height(300);
                console.log('d3.select(#piechart svg)');
                console.log(d3.select('#piechart svg'));
                d3.select('#piechart svg')
                    .datum(datum)
                    .transition().duration(500)
                    .attr('width', 300)
                    .attr('height', 300)
                    .call(chart);
                pie_selected = {};
                pie_color = {};
                that.model.set('selected_json',JSON.stringify(pie_selected));


                },function(){
                            d3.selectAll(".nv-pie .nv-pie .nv-slice").on('click',
                                function(d){
                                            //console.log("piechart_callback_test: clicked on slice " +  JSON.stringify(d['data']));
                                            console.log('/app/fruit?type='.concat(d['data']['label']));

				console.log("clicked!-"+d['data']['label']+":"+ d['data']['data']);
				console.log('current fill core is: ');
				console.log(d3.select(this).style('fill'));
				if (pie_selected[d['data']['label']]  === undefined) {
					console.log('first time click');
					pie_selected[d['data']['label']] ='y';
					pie_color[d['data']['label']] = d3.select(this).style('fill');
					d3.select(this).style('fill','red');
				} else if (pie_selected[d['data']['label']]  == 'y') { 
					console.log('revert back to original color');
					pie_selected[d['data']['label']] ='n';
					d3.select(this).style('fill',pie_color[d['data']['label']]);
				} else{
					console.log('not first time click, but selected');
					pie_selected[d['data']['label']] ='y';
					pie_color[d['data']['label']] = d3.select(this).style('fill');
					d3.select(this).style('fill','red');
				}
				console.log(JSON.stringify(pie_selected));
				console.log( (pie_selected));

				console.log('current selected_json is: ');
				console.log( that.model.get('selected_json'));
				that.model.set('selected_json',JSON.stringify(pie_selected));

				that.touch();
				console.log( that.model.get('selected_json'));
                                
                                
                            
                            
                            })
                }
            );
          });// end of requirejs
            
        },

        handle_spin: function(value) {
            this.model.set('value', value);

            spinner_history = spinner_history + value + ' : ';
            this.model.set('spinner_history_model', spinner_history);

            this.touch();
        },
    });
    
    return {
        NVD3PieView: NVD3PieView
    };
});
console.log('pie widget js loaded!')







// ************
// Bar Chart

requirejs.undef('nvd3bar');

define('nvd3bar', ["jupyter-js-widgets"], function(widgets) {

    var pie_selected = {}
    var pie_color = {} 
    
    var NVD3BarView = widgets.DOMWidgetView.extend({
        render: function() {

            var that = this;
            
            //var svg = d3.select(that.$el[0]).append("svg")
            
            //this.$input = $('<div id="barchart"><svg style="width:400px;height:400px;"></svg></div>');
            //this.$el.append(this.$input);

            //console.log('new_json_data -2 = ' + this.model.get('json_data'))
            this.json_data_changed();
            this.model.on('change:json_data', this.json_data_changed, this);
        },

        json_data_changed: function() {
            
          var that = this;
          var data_barchart = JSON.parse(this.model.get('json_data'));
          console.log('started drawing for json(changed): ' + data_barchart );

          
          require(['d3','nvd3' ],function(d3,nv) {
                console.log('started for json in requirejs.' + JSON.stringify(data_barchart));
                console.log(nv);
                nv.addGraph(function() {
                    console.log('started addGraph');
                    var chart = nv.models.discreteBarChart();

                    //chart.margin({top: 30, right: 60, bottom: 20, left: 60});
                    chart.margin({top: 30, right: 20, bottom: 20, left: 30});

                    var datum = data_barchart;
                    chart.yAxis
                        .tickFormat(d3.format(',.0f'));

                    d3.select('#barchart svg')
                        .datum(datum)
                        .transition().duration(500)
                        .attr('width', 320)
                        .attr('height', 300)
                        .call(chart);
                    pie_selected = {};
                    pie_color = {};
                    that.model.set('selected_json',JSON.stringify(pie_selected));
                },function(){
                  d3.selectAll(".nv-bar").on('click',
                       function(d){
                             console.log("clicked bar:" + JSON.stringify(d));
                                            console.log("clicked:"+d['x']+":"+ d['y']);
                                            console.log('current fill core is: ');
                                            var current_data = d['x'];
                                            console.log(d3.select(this).style('fill'));
                                            if (pie_selected[current_data]  === undefined) {
                                                console.log('first time click');
                                                pie_selected[current_data] ='y';
                                                pie_color[current_data] = d3.select(this).style('fill');
                                                d3.select(this).style('fill','red');
                                            } else if (pie_selected[current_data]  == 'y') { 
                                                console.log('revert back to original color');
                                                pie_selected[current_data] ='n';
                                                d3.select(this).style('fill',pie_color[current_data]);
                                            } else{
                                                console.log('not first time click, but selected');
                                                pie_selected[current_data] ='y';
                                                pie_color[current_data] = d3.select(this).style('fill');
                                                d3.select(this).style('fill','red');
                                            }
                                            console.log(JSON.stringify(pie_selected));
                                            console.log( (pie_selected));

                                            console.log('current selected_json is: ');
                                            console.log( that.model.get('selected_json'));
                                            that.model.set('selected_json',JSON.stringify(pie_selected));

                                            that.touch();
                                            console.log( that.model.get('selected_json'));                      
                   });
                });// end of addgraph 


          });// end of requirejs
            
        },


    });
    
    return {
        NVD3BarView: NVD3BarView
    };
});
console.log('bar widget js loaded!')

// ************
// Sankey Chart
// widget_d3sankey.js @ /home/duan/anaconda3/lib/python3.5/site-packages/ipythond3sankey/static/ipythond3sankey/js
requirejs.undef('d3sankeyview');
//var global_json_data = {'test':'testduan'}
var rect_selected = {}
var rect_color = {}

define('d3sankeyview', ["jupyter-js-widgets"], function(widgets) {
  var D3SankeyView = widgets.DOMWidgetView.extend({
    // namespace your CSS so that you don't break other people's stuff
    className: 'D3SankeyView',

    //loadCss: utils.loadCss,

    // Initialize DOM, etc. called once per view creation,
    // i.e. `display(widget)`
    render: function() {

      // add a stylesheet, if defined in `_view_style`
      //this.loadCss();
        var thatthis = this;
      thatthis.$input = $('<div id="sankeychart"><svg style="width:800px;height:400px;"></svg></div>');
      thatthis.$el.append(this.$input);

        this.value_changed();
        this.model.on('change:node_link_json', this.value_changed, this);        

        return thatthis;
 
    }, // /render

    // Do things that are updated every time `this.model` is changed...
    // from the backend to the front end.
    value_changed: function() {

      console.log('update function called');
      var thatthis = this;

      var graph = JSON.parse(this.model.get('node_link_json'));
      console.log('started drawing for json: ' );
      console.log( graph );

      require(['d3',  'sankey', ], 
              function(d3,  sankey) {

      
      	　console.log('started margin_top 2.' + thatthis.model.get('margin_top'));
		  // console.log('started margin_top 3.' + this.model.get('margin_top'));
		  // setup
		  // XXX margins, width and height not updated
		  var margin = {top:    thatthis.model.get('margin_top'),
						right:  thatthis.model.get('margin_right'),
						bottom: thatthis.model.get('margin_bottom'),
						left:   thatthis.model.get('margin_left')},
			  width = thatthis.model.get('width') - margin.left - margin.right,
			  height = thatthis.model.get('height') - margin.top - margin.bottom;

		  thatthis.width = width;
		  thatthis.height = height;

		  var formatNumber = d3.format(",.0f"),
			  unit = thatthis.model.get('unit');

		  var format = function(d) { return formatNumber(d) + " " + unit; };
		  var color = d3.scale.category20();
		  d3.select("#sankeychart svg").remove();


		  var svg = d3.select("#sankeychart").append("svg") // thatthis.$el[0])
			  .attr("width", width + margin.left + margin.right)
			  .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			  .attr("transform",
					"translate(" + margin.left + "," + margin.top + ")");
		// Set the sankey diagram properties
		var sankey = d3.sankey()
			.nodeWidth(36)
			.nodePadding(40)
			.size([width, height]);

		var path = sankey.link();
		//set up graph in same style as original example but empty
		console.log(JSON.stringify(graph));

		  sankey
			.nodes(graph.nodes)
			.links(graph.links)
			.layout(32);
		console.log( 'add in the links' );

		// add in the links
		var link = svg.append("g").selectAll(".link")
			  .data(graph.links)
			.enter().append("path")
			  .attr("class", "link")
			  .attr("d", path)
			  .style("stroke-width", function(d) { return Math.max(1, d.dy); })
			  .sort(function(a, b) { return b.dy - a.dy; });

		// add the link titles
		link.append("title")
				.text(function(d) {
					return d.source.name + " → " + 
						d.target.name + "\n" + format(d.value); });
		console.log( 'add in the nodes' );


		// add in the nodes
		var node = svg.append("g").selectAll(".node")
			  .data(graph.nodes)
			.enter().append("g")
			  .attr("class", "node")
			  .attr("transform", function(d) { 
				  return "translate(" + d.x + "," + d.y + ")"; })
			.call(d3.behavior.drag()
			  .origin(function(d) { return d; })
			  .on("dragstart", function() { 
				  this.parentNode.appendChild(this); })
			  .on("drag", dragmove));

		// add the rectangles for the nodes
		node.append("rect")
			  .attr("height", function(d) { return d.dy; })
			  .attr("width", sankey.nodeWidth())
			  .style("fill", function(d) { 
				  return d.color = color(d.name.replace(/ .*/, "")); })
			  .style("stroke", function(d) { 
				  return d3.rgb(d.color).darker(2); })
			.append("title")
			  .text(function(d) { 
				  return d.name + "\n" + format(d.value); });

		// add in the title for the nodes
		node.append("text")
			  .attr("x", -6)
			  .attr("y", function(d) { return d.dy / 2; })
			  .attr("dy", ".35em")
			  .attr("text-anchor", "end")
			  .attr("transform", null)
			  .text(function(d) { return d.name; })
			.filter(function(d) { return d.x < width / 2; })
			  .attr("x", 6 + sankey.nodeWidth())
			  .attr("text-anchor", "start");

		// the function for moving the nodes
		function dragmove(d) {
			d3.select(this).attr("transform", 
				"translate(" + d.x + "," + (
						d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
					) + ")");
			sankey.relayout();
			link.attr("d", path);
		  }

		d3.selectAll("rect")
		.on("click",function(d,i){
				// alert("clicked!"+d.value+":"+ d.name);
				console.log("clicked!"+d.value+":"+ d.name);
				console.log('current fill core is: ');
				console.log(d3.select(this).style('fill'));
				if (rect_selected[d.name]  === undefined) {
					console.log('first time click');
					rect_selected[d.name] ='y';
					rect_color[d.name] = d3.select(this).style('fill');
					d3.select(this).style('fill','red');
				} else if (rect_selected[d.name]  == 'y') { 
					console.log('revert back to original color');
					rect_selected[d.name] ='n';
					d3.select(this).style('fill',rect_color[d.name]);
				} else{
					console.log('not first time click, but selected');
					rect_selected[d.name] ='y';
					rect_color[d.name] = d3.select(this).style('fill');
					d3.select(this).style('fill','red');
				}
				console.log(JSON.stringify(rect_selected));
				console.log( (rect_selected));

				console.log('current selected_json is: ');
				console.log( thatthis.model.get('selected_json'));
				thatthis.model.set('selected_json',JSON.stringify(rect_selected));

				thatthis.touch();
				console.log( thatthis.model.get('selected_json'));


		});  // end of setup trigger
		//console.log('setup trigger is done 3');
		//console.log(d3.selectAll('rect'));
	});// end of requirejs
      
    }, // /update


    // Tell Backbone to listen to events (none for now)
    events: {
    },

  }); // /extend

  // The requirej6s namespace.
  return {
    D3SankeyView: D3SankeyView
  };
});

console.log('Sankey JS loaded');

