const axios = require('axios')

axios.get('https://api.ennead.cc/buruaka/character').then(c => {
	c.data.forEach(char => {
		console.log("\"" + char.name + "\": \"" + char.school + "\"" + ',')
	})
})
