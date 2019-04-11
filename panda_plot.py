# file 1
#!/usr/bin/env python
# Name: Thomas Verouden
# Student number: 10779272
"""
This script visualizes data obtained from a .csv file
"""

import csv
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}
print(data_dict)

# put every rating per year in data_dict






# plt.ylim(7.0, 10.0)
# plt.xlim(START_YEAR, END_YEAR)
# plt.plot(X)
# # plt.plot(X, np.sinc(X), c = 'k')
# plt.ylabel("Rating")
# plt.xlabel("Year of release")
# plt.show()


def get_csv():
    """
    Gets rating and year from INPUT_CSV
    """

    return pd.read_csv(INPUT_CSV, quotechar='"', usecols = [1,2])
    # print(data[data["Year"] == 2017].mean())

    # print(data)
    # with open(INPUT_CSV) as csvfile:
    #     dict_reader = csv.DictReader(csvfile)
    #
    #     for row in dict_reader:
    #         data_dict[row["Year"]].append(float(row["Rating"]))

def plot_mean(data):
    data.groupby(['Year']).mean()['Rating'].plot()
    # plt.ylim(7.0, 10.0)
    # plt.xlim(START_YEAR, END_YEAR)
    plt.title("")
    plt.ylabel("Average rating")
    plt.xlabel("Year of release")
    plt.show()




if __name__ == "__main__":
    print(data_dict)
    data = get_csv()
    plot_mean(data)
