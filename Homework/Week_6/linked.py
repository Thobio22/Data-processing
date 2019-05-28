#  !/usr/bin/env python
#      Name: Thomas Verouden
#      Student number: 10779272
#
#      This file visualises the HPI
#
#      source: http://happyplanetindex.org/resources ==> data
#      python -m http.server 8888 &
#      http://localhost:8888/linked.html

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from numpy import percentile


def clean(data):
    """
    This cleans the dataset
    Returns the cleaned dataset
    """
    # replace "unknown" in Pop. density with np.nan
    data = data.replace("unknown", np.nan)

    # replace , with .
    data["Average Life Expectancy"] = data["Average Life Expectancy"].str.replace(",", ".")
    data["Footprint (gha/capita)"] = data["Footprint (gha/capita)"].str.replace(",", ".")
    data["Inequality of Outcomes"] = data["Inequality of Outcomes"].str.replace(",", ".")
    data["Inequality-adjusted Life Expectancy"] = data["Inequality-adjusted Life Expectancy"].str.replace(",", ".")

    data["Average Life Expectancy"] = pd.to_numeric(data["Average Life Expectancy"])
    data["Footprint (gha/capita)"] = pd.to_numeric(data["Footprint (gha/capita)"])
    data["Inequality of Outcomes"] = pd.to_numeric(data["Inequality of Outcomes"])
    data["Inequality-adjusted Life Expectancy"] = pd.to_numeric(data["Inequality-adjusted Life Expectancy"])
    data["Population"] = pd.to_numeric(data["Population"])

    return data


def convert_to_json(cleansed):
    """
    This converts the input data to json format
    """
    clean = cleansed.to_json("happiness.json", orient="records")
    byCountry = cleansed.set_index("Country").to_json("happiness_country.json", orient="index")


if __name__ == "__main__":

    # read data into pandas dataframe
    data = pd.read_csv("happiness.csv", delimiter=";")

    # clean up the data
    cleansed = clean(data)
    convert_to_json(cleansed)
