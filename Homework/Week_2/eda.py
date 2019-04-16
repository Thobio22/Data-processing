#!/usr/bin/env python
# Name: Thomas Verouden
# Student number: 10779272
"""
This script cleans an input dataset with pandas and outputs a CSV file with
visualised population and country details
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot


def clean(subdata):
    """
    This cleans the dataframe for visualisation
    Returns a cleansed subdata
    """

    # replace 'unknown' in Pop. density with np.nan
    subdata = subdata.replace('unknown', np.nan)

    # replace ',' to '.' in pop. dens and infant mort
    subdata['Pop. Density (per sq. mi.)'] = \
    subdata['Pop. Density (per sq. mi.)'].str.replace(',', '.')

    subdata['Infant mortality (per 1000 births)'] = \
    subdata['Infant mortality (per 1000 births)'].str.replace(',', '.')

    # remove 'dollars' from GDP and set to appropraite numeric
    subdata['GDP ($ per capita) dollars'] = \
    subdata['GDP ($ per capita) dollars'].str.replace(' dollars', '')

    subdata['GDP ($ per capita) dollars'] = \
    pd.to_numeric(subdata['GDP ($ per capita) dollars'])

    # set wrong data in frame to np.nan:
    # the GDP value of Suriname will be set to np.nan due to incorrect values
    subdata.at['GDP ($ per capita) dollars', 'Suriname'] = np.nan

    return subdata


def plot_gdp(cleansed):
    """
    This calculates mean, median, mode and standard dev. of GDP, and plots a histogram
    """
    # calculate mean, median, mode and standard deviation of cleansed df
    mean = int(cleansed['GDP ($ per capita) dollars'].mean())
    print(f'Mean GDP in dollars:   {mean}')
    median = cleansed['GDP ($ per capita) dollars'].median()
    print(f'Median GDP in dollars: {median}')
    mode = cleansed['GDP ($ per capita) dollars'].mode()[0]
    print(f'Mode GDP in dollars:   {mode}')
    st_dev = int(cleansed['GDP ($ per capita) dollars'].std())
    print(f'Standard Deviation of GDP in dollars: {st_dev}')

    # plot histogram
    cleansed['GDP ($ per capita) dollars'].plot.hist()
    plt.title("GDP in dollars per country")
    plt.ylabel("GDP in dollars")
    plt.xlabel("Country")
    plt.show()


def plot_mortality(cleansed):
    """
    Visualises the five number summary of infant mortality in a boxplot
    """
    cleansed['Infant mortality (per 1000 births)'].boxplot()
    plt.title('Infant mortality (per 1000 births)')
    plt.ylabel('infant mortality')
    plt.xlabel('')




if __name__ == "__main__":

    # read data into pandas dataframe
    data = pd.read_csv("input.csv")

    # take subset from needed columns only
    subdata = data[['Country', 'Region', 'Pop. Density (per sq. mi.)', 'Infant mortality (per 1000 births)', 'GDP ($ per capita) dollars']]

    # clean up the data
    cleansed = clean(subdata)
    # print(cleansed)

    # calculate and visualise mean, median, mode for GDP
    GDP = plot_gdp(cleansed)

    # visualise infant mortality in a boxplot
    mortality = plot_mortality(cleansed)
