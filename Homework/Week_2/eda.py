#!/usr/bin/env python
# Name: Thomas Verouden
# Student number: 10779272
"""
This script cleans an input dataset with pandas and outputs a CSV file with
visualised population and country details
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from numpy import percentile


POP_DENS = 'Pop. Density (per sq. mi.)'
INF_MORT = 'Infant mortality (per 1000 births)'
GDP = 'GDP ($ per capita) dollars'


def clean(subdata):
    """
    This cleans the dataframe for visualisation
    Returns a cleansed subdata
    """
    # replace 'unknown' in Pop. density with np.nan
    subdata = subdata.replace('unknown', np.nan)

    # remove spaces from Country and Region columns
    subdata['Country'] = subdata['Country'].str.strip()
    subdata['Region'] = subdata['Region'].str.strip()

    # replace ',' to '.' in pop. dens and infant mortality
    subdata[POP_DENS] = \
    subdata[POP_DENS].str.replace(',', '.')

    subdata[INF_MORT] = \
    subdata[INF_MORT].str.replace(',', '.')

    # remove 'dollars' from GDP and set to appropraite numeric
    subdata[GDP] = \
    subdata[GDP].str.strip(' dollars')

    # set pop. density, infant mort. and GDP columns to numeric values
    subdata[GDP] = pd.to_numeric(subdata[GDP])
    subdata[POP_DENS] = pd.to_numeric(subdata[POP_DENS])
    subdata[INF_MORT] = pd.to_numeric(subdata[INF_MORT])

    # the GDP value of Suriname will be set to np.nan due to factually incorrect values
    subdata.at[193, GDP] = np.nan

    return subdata


def plot_gdp(cleansed):
    """
    This calculates mean, median, mode and standard dev. of GDP, and plots a histogram
    """
    # calculate mean, median, mode and standard deviation of cleansed df
    print('The following values represent the mean, median, and mode of the \
          GDP ($ per capita) dollars data')
    mean = cleansed[GDP].mean(skipna=True)
    print(f'Mean:      %.1f' % mean)
    median = cleansed[GDP].median(skipna=True)
    print(f'Median:    {median}')
    mode = cleansed[GDP].mode()[0]
    print(f'Mode:      {mode}')
    st_dev = cleansed[GDP].std(skipna=True)

    # plot histogram
    cleansed[GDP].plot.hist()
    plt.title("GDP in dollars per country")
    plt.ylabel("Number of Countries")
    plt.xlabel("GDP in dollars")
    plt.axis([0, 60000, 0, 120])
    plt.grid()
    plt.show()


def plot_mortality(cleansed):
    """
    Calculates, prints and visualises the five number summary of
    infant mortality in a boxplot
    """
    # calculate minimum, first quartile, median, third quartile and maximum
    minimum, maximum = cleansed[INF_MORT].min(skipna=True), cleansed[INF_MORT].max(skipna=True)
    quartiles = np.nanpercentile(cleansed[INF_MORT], [25, 50, 75])

    # print 5-number summary
    print('The following values represent the Five Number Summary of the \
          Infant Mortality data')
    print('Minimum:   %.2f' % minimum)
    print('Q1:        %.2f' % quartiles[0])
    print('Median:    %.2f' % quartiles[1])
    print('Q3:        %.2f' % quartiles[2])
    print('Maximum:   %.2f' % maximum)

    # plot boxplot of infant mortality
    cleansed.boxplot(column = [INF_MORT])
    plt.title('Infant mortality (per 1000 births)')
    plt.ylabel('Mortality numbers')
    plt.show()


def convert_to_json(cleansed):
    """
    This converts the input data to json format
    """
    cleansed = cleansed.set_index('Country').to_json('cleansed_data.json', orient = 'index')


if __name__ == "__main__":

    # read data into pandas dataframe
    data = pd.read_csv("input.csv")

    # take subset from needed columns only
    subdata = data[['Country', 'Region', POP_DENS, INF_MORT, GDP]]

    # clean up the data
    cleansed = clean(subdata)

    # calculate and visualise mean, median, mode for GDP
    plot_gdp(cleansed)

    # calculate Five Number Summary and visualise infant mortality in a boxplot
    plot_mortality(cleansed)

    # convert the cleansed data to json format
    convert_to_json(cleansed)
