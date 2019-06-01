// pipeline parser
var columnsJson = {}; // results from HubSpot API here
var pipelineColumns = columnsJson.results.map((option) => {
  return option.label;
})

pipelineColumns.unshift('id', 'name');
module.exports.pipelineColumns = pipelineColumns;

// deal stage parser
var dealStageJson = {}; // results from HubSpot API here
var dealStages = dealStageJson.results[0].stages.map((stage) => {
  return stage.label;
});
dealStages.unshift('id', 'name');
module.exports.dealStages = dealStages;