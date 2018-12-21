function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var sampleURL = "/metadata/" + sample;
  d3.json(sampleURL).then(function(data) {

    // Use d3 to select the panel with id of `#sample-metadata`
    metaDiv = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    metaDiv.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    metaDiv.append("ul")
    Object.entries(data).map((data, index)=>{
      metaDiv.append("li").text(data[0] + ": " + data[1]);
    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });
}

function buildCharts(sample, redraw_flag = false) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sampleURL = "/samples/" + sample;
  d3.json(sampleURL).then(function(data) {

  // @TODO: Build a Bubble Chart using the sample data
    
    console.log(data);

    var bubble_labels =  Object.values(data.otu_labels);
    var y = Object.values(data.sample_values);
    var x = Object.values(data.otu_ids);

    var bubble_trace = {
      x: x,
      y: y,
      mode: "markers",
      marker: {size: y},
      text: bubble_labels,
      hoverinfo: ["x+y", "text"]
    };

    var layout = { margin: { t: 30, b: 100 },
                  title: "Sample Magnitude" };
    if (!redraw_flag) {
      Plotly.plot("bubble", [bubble_trace], layout);}
    else {
      Plotly.newPlot("bubble", [bubble_trace], layout);
    }

  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).

    var pie_labels =  Object.values(data.otu_labels).slice(1, 10);
    var pie_values = Object.values(data.sample_values).slice(1, 10);
    var otu_ids = Object.values(data.otu_ids).slice(1, 10);

    var pie_trace = {
      labels: otu_ids,
      values: pie_values,
      text: pie_labels,
      hoverinfo: 'text',
      type: 'pie'
    };

    var layout = { margin: { t: 30, b: 100 },
                  title: "Top 10 Samples" };
    if (!redraw_flag) {
      Plotly.plot("pie", [pie_trace], layout);}
    else {
      Plotly.newPlot("pie", [pie_trace], layout);
    }
  });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample, true);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

