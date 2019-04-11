#!/usr/bin/env python
# Name: Thomas Verouden
# Student number: 10779272
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}
print(data_dict)


def set_data_dict():
    """
    Sets rating values from INPUT_CSV in data_dict per year
    """
    # search in INPUT_CSV
    with open(INPUT_CSV) as inputfile:
        dict_reader = csv.DictReader(inputfile)

        for row in dict_reader:
            data_dict[row["Year"]].append(float(row["Rating"]))


def plot_mean():
    """
    Calculates, then plots the mean ratings per year
    """
    # define mean data
    mean = {}
    for year, ratings in data_dict.items():
        mean[year] = sum(ratings)/float(len(ratings))

    # define x and y-axis values
    x = mean.keys()
    y = mean.values()

    # limit plot to full rating scale to prevent exaggerated differences
    plt.ylim(0,10)

    # plot x and y, title and labels
    plt.plot(x, y)
    plt.title("Mean rating of IMDb's Top 50 movies")
    plt.ylabel("Average rating")
    plt.xlabel("Year of release")
    plt.show()




if __name__ == "__main__":
    set_data_dict()
    plot_mean()
