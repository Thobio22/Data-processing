#!/usr/bin/env python
# Name: Thomas Verouden
# Student number: 10779272
"""
Dit script maakt een linechart van de gekozen dataset
Vraag: Is er een verschil in hoogste windstoten boven schiphol in de afgelopen 10 jaar?
"""

import matplotlib.pyplot as plt
import pandas as pd
from sys import argv


# def read2pandas(file_name):
#     """
#     This converteerd de data naar pandas dataset
#     verwijderd de # header in de KNMI file
#     """
#     exclude = '#'
#     dataframe = pd.read_csv(file_name)
#     dataframe = dataframe[~dataframe.Column1.str.contains(exclude)]
#
#     return dataframe

# def read2pandas(file_name):
#     """
#     slaat rijen over met '#'
#     """
#
#     skip_rows = 0
#     with open(file_name, 'r') as f:
#         for line in f:
#             if line.contains('#'):
#                 skip_rows += 1
#             else:
#                 break
#
#     dataframe = pd.read_csv(file_name, skiprows=skip_rows)
#     return dataframe

if __name__ == "__main__":

    if len(argv) != 2:
        quit('Usage: python file_name')

    # import file_name
    file_name = argv[1]
    print(file_name)

    if file_name == False:
        quit('Usage: python file_name')

    # maak pandas dataframe van KNMI zonder comments
    # dataframe = read2pandas(file_name)
    if '.csv' in file_name:
        dataframe = pd.read_csv(file_name, comment='#')
    elif '.txt' in file_name:
        dataframe = pd.read_csv(file_name, delimiter = ',', comment='#')
    else:
        quit('Usage: use files of .csv or .txt format')

    print(dataframe)
