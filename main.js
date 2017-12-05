
// **** Your JavaScript code goes here ****
// Chez Browne
// cbrowne7
d3.csv('./data/coffee_data.csv', function(error, dataset) {
    if(error) {
        console.error('Error loading exoplanets.csv dataset');
        console.log(error);
        return;
    }

    // Setup
    var svg = d3.select("svg");
    var regionChart = svg.append("g");
    var catChart = svg.append("g");


    // Dimensions
    var padding = {l:80, r:80, t:80, b:80, m:60, axis:40};
    var dims = {width:+svg.attr("width"), height:+svg.attr("height")};
    dims.width = dims.width - padding.l - padding.r;
    dims.height = dims.height - padding.t - padding.b;
    var chartWidth = (dims.width/2.0);


    // Data
    var salesByRegion = d3.nest()
        .key(function(d) {return d.region})
        .rollup(function(v) {return d3.sum(v, function(d) {return d.sales})})
        .entries(dataset);

    var salesByCat = d3.nest()
        .key(function(d) {return d.category})
        .rollup(function(v) { return d3.sum(v, function(d) {return d.sales})})
        .entries(dataset);


    // Scales
    var region = salesByRegion.map(function(d) {
        return d['key'];
    });

    var category = salesByCat.map(function(d) {
        return d['key'];
    });

    var regionXScale = d3.scaleBand()
            .domain(region)
            .padding(0.35)
            .range([0,chartWidth - padding.m]);

     var catXScale = d3.scaleBand()
            .domain(category)
            .padding(.35)
            .range([chartWidth + padding.m, dims.width]);


    var sales = d3.max(salesByRegion, function(d) {
        return +d['value'];
    });

    var regionYScale = d3.scaleLinear()
            .domain([0,sales])
            .range([0, dims.height]);

    var regionYAxisScale = d3.scaleLinear()
            .domain([0,sales])
            .range([dims.height, 0]);


    var regColorScale = d3.scaleOrdinal()
        .domain(region)
        .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3']);

    var catColorScale = d3.scaleOrdinal()
        .domain(category)
        .range(['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3']);



    // Bars
    var regionBar = regionChart.selectAll("rect")
        .data(salesByRegion)
        .enter()
        .append("rect")
        .attr('class', 'chart')
        .attr("height", function (d) {return regionYScale(d["value"]);})
        .attr("y", function (d) {return (dims.height - regionYScale(d["value"])) + padding.t;})
        .attr("width", regionXScale.bandwidth())
        .attr("x", function(d) {return padding.l + regionXScale(d["key"]);})
        .attr("fill", function(d) {return regColorScale(d['key']);});


     var catBar = catChart.selectAll("rect")
            .data(salesByCat)
            .enter()
            .append("rect")
            .attr('class', 'chart')
            .attr("height", function (d) {return regionYScale(d["value"]);})
            .attr("y", function (d) {return (dims.height - regionYScale(d["value"])) + padding.t;})
            .attr("width", catXScale.bandwidth())
            .attr("x", function(d) {return padding.l + catXScale(d["key"]);})
            .attr("fill", function(d) {return catColorScale(d['key']);});



    // Axis
    var xAxisRegion = d3.axisBottom(regionXScale).ticks(4);
    var xAxisCat = d3.axisBottom(catXScale).ticks(4);
    var yAxisRegion = d3.axisLeft(regionYAxisScale).ticks(5);
    yAxisRegion.tickFormat(d3.format(".2s"))

    regionChart.append('g')
        .attr('class', 'x_axis')
        .attr('transform', 'translate('+ padding.l +',' + (dims.height + 1.15*padding.t) + ')')
        .text('Region')
        .call(xAxisRegion);

    regionChart.append('g')
        .attr("class", "y_axis")
        .attr("transform", "translate(" + padding.l + "," + padding.b + ")")
        .text("Coffee Sales (USD)")
        .call(yAxisRegion);

    catChart.append('g')
        .attr('class', 'x_axis')
        .attr('transform', 'translate('+ padding.l +',' + (dims.height + 1.15*padding.t) + ')')
        .text('Category')
        .call(xAxisCat);

    catChart.append('g')
        .attr("class", "y_axis")
        .attr("transform", "translate(" + (chartWidth + padding.m + padding.l) + "," + padding.b + ")")
        .text("Coffee Sales (USD)")
        .call(yAxisRegion);


    // Chart Titles
    regionChart.append("text")
        .attr("x", (chartWidth/2) - padding.m)
        .attr("y", padding.axis)
        .text("Coffee Sales by Region (USD)");

    catChart.append("text")
        .attr("x", (1.3*chartWidth) + padding.m)
        .attr("y", padding.axis)
        .text("Coffee Sales by Product (USD)");


    // X Axis Titles
     regionChart.append("text")
        .attr("x", (chartWidth/2) + .5*padding.m)
        .attr("y", dims.height + 1.6*padding.t)
        .attr("class", "axis_label")
        .text("Region");

      catChart.append("text")
        .attr("x", (1.5*chartWidth) + 1.5*padding.m)
        .attr("y", dims.height + 1.6*padding.t)
        .attr("class", "axis_label")
        .text("Product");

    // Y Axis Titles
    catChart.append("text")
        .attr("y", .5*padding.t)
        .attr("transform", "translate(-5,"+ (.80*dims.height)+ "), rotate(-90)")
        .attr("class", "axis_label")
        .text("Coffee Sales(USD)");

    regionChart.append("text")
        .attr("y", padding.axis)
        .attr("transform", "translate(" + (chartWidth + padding.axis)
            + ","+ .80*dims.height + "), rotate(-90)")
        .attr("class", "axis_label")
        .text("Coffee Sales(USD)");
});
console.log("Do something else, without the data");