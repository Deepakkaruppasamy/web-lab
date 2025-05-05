const { parentPort, workerData } = require('worker_threads');
function processData(data) {
    data.processedAt = new Date().toISOString();
    return data;
}
parentPort.postMessage(processData(workerData));