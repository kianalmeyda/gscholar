import axios from 'axios';
import cheerio from 'cheerio';
import express from 'express';

const app = express();
const port = process.env.PORT || 6000;


const fetchData = async (query) => {
	try {
		const url = `https://scholar.google.com/scholar?q=${query}`;

		const response = await axios.get(url);

		if (response.status === 200) {
			const html = response.data;
			const $ = cheerio.load(html);

			const results = [];
			$('h3.gs_rt a').each((index, element) => {
				const title = $(element).text();
				const link = $(element).attr('href');
				results.push({ title, link });
			});

			return results;
		} else {
			console.error('Error: Unable to fetch data');
		}
	} catch (error) {
		console.error('Error: ', error);
	}
};

app.get('/api/gschoolar', async (req, res) => {
	const search = req.query.s;
	if (!search) {
		res.json({ error: "Invalid request, missing 's' query parameter" });
		return;
	}

	const results = await fetchData(search); 
	res.json(results);
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
