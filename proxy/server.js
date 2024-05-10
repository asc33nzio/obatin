require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Axios = require("axios");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/ping", async (req, res) => {
  try {
    res.json({ message: "pong" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/rajaongkir/:path", async (req, res) => {
  try {
    const { path } = req.params;
    const queryParams = { ...req.query };

    let url = `https://api.rajaongkir.com/starter/${path}`;
    if (Object.keys(queryParams).length > 0) {
      url += `?${new URLSearchParams(queryParams).toString()}`;
    }

    const response = await Axios.get(url, {
      headers: {
        key: process.env.RAJAONGKIR_API_KEY,
      },
    });

    res.json(response.data.rajaongkir.results);
  } catch (error) {
    const rajaOngkirErr =
      error?.response?.data?.rajaongkir?.status?.description;

    if (rajaOngkirErr !== undefined) {
      res.status(400).json({ message: rajaOngkirErr });
      return;
    }

    res.status(500).json({ message: rajaOngkirErr });
  }
});

app.get("/api/opencage", async (req, res) => {
  try {
    const { q } = req.query;
    const response = await Axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          q,
          countrycode: "id",
          limit: 1,
          language: "id",
          key: process.env.OPENCAGE_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
