const { JSONParse } = require('./JSONData.js')

const GetStudentArray = () => {
	const list = JSONParse('./Utils/Students/students.json')

	let retList = []
	for (let char in list) {
		retList.push(char)
	}

	return retList
}

module.exports = { GetStudentArray }

