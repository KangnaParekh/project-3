url_met = "https://raw.githubusercontent.com/Urja1529/Project-3/main/data/met_data.json";

d3.json(url_met).then(function(fetcheddata) {
  console.log("museum:", fetcheddata);

  // Initialized arrays
  let catData = {};
  let dogData = {};
  let bothData = {};
  let centuries = [];

  // For loop to populate arrays
  for (var id in fetcheddata) {
    var entry = fetcheddata[id];
    var teamValue = entry.team;
    var century = entry.yearCentury;

    // Separate data for cats and dogs
    if (teamValue === "cat") {
      if (!catData[century]) catData[century] = 0;
      catData[century]++;
    } else if (teamValue === "dog") {
      if (!dogData[century]) dogData[century] = 0;
      dogData[century]++;
    }

    // Data for both categories
    if (!bothData[century]) bothData[century] = 0;
    bothData[century]++;

    if (!centuries.includes(century)) {
      centuries.push(century);
    }
  }

  // Sort centuries
  centuries.sort();

  // Create slider steps based on available centuries
  let sliderSteps = centuries.map(century => ({
    label: century,
    method: "animate",
    args: [
      [
        [
          catData[century] || 0,
          dogData[century] || 0,
          bothData[century] || 0
        ]
      ],
      {
        transition: { duration: 300, easing: "cubic-in-out" },
        frame: { duration: 300, redraw: false },
        mode: "immediate"
      }
    ]
  }));

  // Define initial data
  let initialData = [
    {
      x: ["Cat", "Dog", "Both"],
      y: [catData[centuries[0]] || 0, dogData[centuries[0]] || 0, bothData[centuries[0]] || 0],
      text: ["Cat", "Dog", "Both"],
      name: "CatvsDog",
      type: "bar",
      marker: {
        color: ["pink", "blue", "purple"]
      }
    }
  ];

  // Define layout
  let layout = {
    title: "Cat vs Dog vs Both search results",
    barmode: "relative",  // Bar mode set to "relative"
    margin: {
      l: 100,
      r: 100,
      b: 200,
      t: 100,
      pad: 4
    },
    width: 800,
    height: 600,
    xaxis: {
      title: "Category",
      tickangle: -45
    },
    yaxis: {
      title: "Count",
      range: [0, Math.max(...Object.values(catData, dogData, bothData)) + 1]
    },
    sliders: [
      {
        steps: sliderSteps,
        transition: { duration: 300, easing: "cubic-in-out" },
        x: 0.1,
        len: 0.9,
        currentvalue: {
          xanchor: "right",
          prefix: "Year Century: ",
          font: { color: "#888", size: 20 }
        },
        bgcolor: "#fff",
        active: 0,
        pad: { t: 50 }
      }
    ]
  };

  // Create animation frames
  let frames = centuries.map(century => ({
    name: century,
    data: [
      {
        x: ["Cat", "Dog", "Both"],
        y: [catData[century] || 0, dogData[century] || 0, bothData[century] || 0]
      }
    ]
  }));

  // Add start and stop buttons
  let startButton = document.getElementById("startButton");
  let stopButton = document.getElementById("stopButton");
  let currentIndex = 0;
  let animationInterval;

  function startAnimation() {
    stopAnimation(); // Stop any ongoing animation

    animationInterval = setInterval(function() {
      Plotly.animate("plota", frames, {
        transition: { duration: 0 },
        frame: { duration: 500, redraw: true },
        fromcurrent: true,
        mode: "immediate"
      });

      currentIndex = (currentIndex + 1) % centuries.length;
    }, 1000); // Change this interval as needed
  }

  function stopAnimation() {
    clearInterval(animationInterval);
  }

  startButton.addEventListener("click", startAnimation);
  stopButton.addEventListener("click", stopAnimation);

  // Create the initial plot
  Plotly.newPlot("plota", initialData, layout);
});


