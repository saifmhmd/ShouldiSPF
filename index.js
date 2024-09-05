import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import "dotenv/config";

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/protect", async (req, res) => {
    try {
        const cityName = req.body.city;
        const APIKEY = process.env.OPEN_WEATHER_API_KEY;

        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKEY}`);
        const { lat, lon } = response.data.coord;

        const uvResponse = await axios.get(`https://currentuvindex.com/api/v1/uvi?latitude=${lat}&longitude=${lon}`);
        const uvIndex = uvResponse.data.now.uvi;
        

        let advice;

        if (uvIndex < 3 ) {
            advice = `UV index is ${uvIndex} in ${cityName}, NO NEED of Sunscreen today.`
        } else if (uvIndex >= 3 && uvIndex <= 4) {
            advice = `UV index is ${uvIndex} in ${cityName}, It is recommended to wear Sunscreen today.`
        } else {
            advice = `Oh no UV index is ${uvIndex} in ${cityName}, You should definitely wear Sunscreen today.`
        }

        res.render("index.ejs", {
            cityName,
            uvIndex,
            advice,
        });
    } catch(error) {
        res.render("index.ejs", {
            cityName: null,
            UVindex: null,
            error: "City not found or an error occured."
        });
    }
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});