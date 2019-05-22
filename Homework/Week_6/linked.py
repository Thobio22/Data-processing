#  !/usr/bin/env python
#      Name: Thomas Verouden
#      Student number: 10779272
#
#      This file visualises the amount of teens in violent areas against the
#      amount of teen pregnancies in a d3 scatterplot, with the Country GDP indicated by color.
#
#      source: http://happyplanetindex.org/resources ==> data
#      python -m http.server 8888 &
#      http://localhost:8888/scatter.html

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

    # remove dollar symbol
    data[["Average Life Expectancy",\
          "Footprint (gha/capita)",\
          "Inequality of Outcomes",\
          "Inequality of Outcomes",\
          "Inequality-adjusted Life Expectancy",\
          "Population"]]\
          = data[["Average Life Expectancy",\
                  "Footprint (gha/capita)",\
                  "Inequality of Outcomes",\
                  "Inequality of Outcomes",\
                  "Inequality-adjusted Life Expectancy",\
                  "Population"]].str.replace(",", ".")

    # set adjusted gross to integer
    data["HPI Rank"]\
        ["Average Life Expectancy"]\
        ["Footprint (gha/capita)"]\
        ["Inequality of Outcomes"]\
        ["Inequality of Outcomes"]\
        ["Inequality-adjusted Life Expectancy"]\
        ["Population"] \
        = pd.to_numeric(data["HPI Rank"]\
        ["Average Life Expectancy"]\
        ["Footprint (gha/capita)"]\
        ["Inequality of Outcomes"]\
        ["Inequality of Outcomes"]\
        ["Inequality-adjusted Life Expectancy"]\
        ["Population"])

    return data


def convert_to_json(cleansed):
    """
    This converts the input data to json format
    """
    cleansed = cleansed.to_json("cleansed_happiness.json", orient="records")


if __name__ == "__main__":

    # read data into pandas dataframe
    data = pd.read_csv("happiness.csv", delimiter=";")

    # clean up the data
    cleansed = clean(data)
    convert_to_json(cleansed)
