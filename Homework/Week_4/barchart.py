# source data: https://www.boxofficemojo.com/franchises/chart/?view=main&id=marvelcomics.htm&p=.htm

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from numpy import percentile


def clean(data):
    """
    This cleans the dataset
    Returns the cleaned dataset
    """
    # replace 'unknown' in Pop. density with np.nan
    data = data.replace('unknown', np.nan)

    # replace , with . in Adjusted Gross
    data['Adjusted Gross'] = data['Adjusted Gross'].str.replace(',', '')

    # remove dollar symbol
    data['Adjusted Gross'] = data['Adjusted Gross'].str.replace('$', '')

    # set adjusted gross to integer
    data['Adjusted Gross'] = pd.to_numeric(data['Adjusted Gross'])

    return data


def convert_to_json(cleansed):
    """
    This converts the input data to json format
    """
    cleansed = cleansed.to_json('cleansed_marvel_gross.json', orient = 'records')


if __name__ == "__main__":

    # read data into pandas dataframe
    data = pd.read_csv('barchart_marvel_gross.csv', delimiter=';')

    # clean up the data
    cleansed = clean(data)
    convert_to_json(cleansed)
