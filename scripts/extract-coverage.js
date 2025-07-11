const report = require("../coverage/coverage-summary.json")
const percent = report.total.branches.pct;

console.log(`COVERAGE_VALUE=${Math.round(percent)}`)
