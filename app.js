
d3.json('samples.json').then(function(data) {
  console.log(data)
});

// intialize the app to pull from the first name in the dropdown list
function init(){

  d3.json('samples.json').then(function(data) {

    // iterate through each sample id in the name array and insert it into the dropdown
    data.names.forEach((name) => {
      d3.select("#selDataset")
      .append("option")
      .text(name)
      .property("value");
    });

    buildPlots(data.names[0]);
    demoInfo(data.names[0]);
  });
}

// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#selDataset").on("change", updatePlotly);

// this function is called when a dropdown menu item is selected
function updatePlotly() {
  // use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selDataset");
  // assign the value of the dropdown menu option to a variable
  var newSelection = dropdownMenu.property("value");

  buildPlots(newSelection);
  demoInfo(newSelection);
}

function demoInfo(selected_id) {
  d3.json("samples.json").then(function(data) {

    var filteredMetaData = data.metadata.filter(meta => meta.id == selected_id)[0];

    var metaData = d3.select("#sample-metadata");

    metaData.html("")

    Object.entries(filteredMetaData).forEach((key)=>{
      metaData.append("p").text(key[0] + ":" + key[1]);
    });

  });

}

function buildPlots(selected_id) {

  // fetch the JSON data
  d3.json("samples.json").then(function(data) {

    // filter the samples for the ID chosen
    var filteredSample = data.samples.filter(sample => sample.id == selected_id);
    
    var sample_id = filteredSample[0].id
    // console.log(sample_id)
    var otu_ids = filteredSample[0].otu_ids
    // console.log(otu_ids)
    var otu_labels = filteredSample[0].otu_labels
    // console.log(otu_labels)
    var sample_values = filteredSample[0].sample_values

    // sort arrays to get the top 10 values in each
    var top10_sample_values = sample_values.slice(0, 10).reverse();
    var top10_otu_ids = otu_ids.slice(0, 10).reverse();
    var top10_otu_labels = otu_labels.slice(0, 10).reverse();

    var otu_id_labels = []

    for (var i = 0; i < top10_otu_ids.length; i++) {
      otu_id_labels.push("OTU " + top10_otu_ids[i]);
    }

    // create the trace
    var trace1 = {
      x: top10_sample_values,
      y: otu_id_labels,
      text: top10_otu_labels,
      type: "bar",
      orientation: "h",
      marker: {
          color: "#1978B5"
      }
    };

    // layout of the bar chart
    var bar_layout = {
      height: 500,
      width: 400,
    };

    bar_data = [trace1];

    Plotly.newPlot("bar", bar_data, bar_layout);

    // create trace
    var trace2 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: 'YlGnBu'
      }
    };

    // layout of the bubble chart
    var bubble_layout = {
      height: 700,
      width: 1300,
    };

    // create the data array for the plot
    var bubble_data = [trace2];

    // plot the bubble chat to the appropriate div
    Plotly.newPlot('bubble', bubble_data, bubble_layout);

  });

}

// call to initializes the app
init();