#!/usr/bin/env python
# Name: Thomas Verouden
# Student number: 10779272
"""
This script converts a chosen data file (.txt or .csv) to JSON
"""

import pandas as pd
import numpy as np
from sys import argv


def convert_to_json(dataframe):
    """
    This converts the input data to json format
    """
    dataframe = dataframe.set_index('YYYYMMDD').to_json('schiphol_windstoten.json', orient = 'index')


def getDataframe(file_name):
    """
    This pulls the data set in the folder and converts it to a dataframe using read2pandas
    """
    # maak pandas dataframe van KNMI zonder comments
    if '.csv' in file_name:
        dataframe = pd.read_csv(file_name, delimiter = ';', comment='#')
        return dataframe
    elif '.txt' in file_name:
        dataframe = pd.read_csv(file_name, delimiter = ',', comment='#')
        return dataframe
    else:
        quit('Usage: use files of .csv or .txt format')


def clean(dataframe):
    """
    This cleans the dataframe for visualisation
    Returns a cleansed subdata
    """
    # replace 'unknown' in Pop. density with np.nan
    dataframe = dataframe.replace('unknown', np.nan)

    # remove spaces from column names and content
    dataframe.columns = dataframe.columns.str.strip()

    return dataframe


if __name__ == "__main__":

    if len(argv) != 2:
        quit('Usage: python file_name')

    # import file_name
    file_name = argv[1]
    print(file_name)

    # check if file_name == actual file in folder
    if file_name == False:
        quit('Usage: python file_name')

    # make dataframe from data file
    dataframe = getDataframe(file_name)

    # clean the dataframe
    dataframe = clean(dataframe)

    # take subset from needed columns only: ONLY USE THIS IF NECESSARY!!
    dataframe = dataframe[['YYYYMMDD', 'FXX']]

    # convert the dataframe to JSON
    convert_to_json(dataframe)
