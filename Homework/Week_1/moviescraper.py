#!/usr/bin/env python
# Name: Thomas Verouden
# Student number: 10779272
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """
    # inspect the actual site elements; movie information is in tag: div, class: lister-item-content
    # find all movie INFORMATION
    movieinfo = []
    movielist = dom.findAll("div", {"class": "lister-item-content"})
    # iterate blocks
    for movie in movielist:
        # navigate to title element; tag: h3, class: lister-title-header
        movieTitle = movie.find("h3", {"class": "lister-item-header"})
        # get title only
        title = movieTitle.a.string


        # navigate to rating element; tag:div, class: inline-block ratings-imdb-rating
        movieRating = movie.find("div", {"class", "inline-block ratings-imdb-rating"})
        # get rating only
        rating = movieRating.strong.string


        # year already in movieTitle
        movieYear = movieTitle.find("span", {"class", "lister-item-year"})
        # get year only
        year = movieYear.string

        # year in numbers only (<--no brackets-->)
        year = year[-5:-1]
        print(year)


        # navigate to Actors/Actresses element; tag: p, class: ""
        movieActors = movie.find_all("p", {"class", ""})

        # get actor/resses only, after text:Stars
        actorlist = []
        # iterate over movieActors
        for names in movieActors:
            # select actors only
            actors = names.select('a[href*=st]')
            # select names of actors only
            for name_only in actors:
                actorlist.append(name_only.text)
        # join actor names in list into 1 string
        actorlist = ', '.join(actorlist)


        # navigate to runtime; tag: span, class: runtime
        movieRuntime = movie.find("span", {"class", "runtime"})
        # get runtime only
        runtime = movieRuntime.string
        # numbers only (no "min")
        runtime = runtime[0:3]


        # append all movie info to a dict, then append to list
        moviedict = {"Title": title, "Rating": rating, "Year": year, "Actors": actorlist, "Runtime": runtime}

        movieinfo.append(moviedict)


    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED MOVIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.

    return movieinfo


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])
    # write individual data to csv file
    for movie in movies:
        writer.writerow([movie["Title"], movie["Rating"], movie["Year"], movie["Actors"], movie["Runtime"]])


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
