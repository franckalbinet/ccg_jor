d3.json("./data/children.json", function(data) {
  var cf = crossfilter(data);
  var gender = cf.dimension(function(d) { return d.gender; });
  var age = cf.dimension(function(d) { return d.age; });
  var household = cf.dimension(function(d) { return d.hh; });

  var childrenByHousehold = household.group();
  var childrenByAge = age.group();
  var childrenByGender = gender.group();

  var householdByChildren = d3.nest()
    .key(function(d) { return d.value; })
    .rollup(function(leaves) { return leaves.length; })
    .entries(childrenByHousehold.top(Infinity));

  // To get the list of filtered households
  // filtHousehold = new Array();
  // childrenByHousehold.top(Infinity).forEach(function(d) {
  //    if (d.value != 0) filtHousehold.push(d.key);
  //  })

  debugger;
})
