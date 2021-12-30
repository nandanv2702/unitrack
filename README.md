# UniTrack

Sort professors by rating and GPA trend for any course in this semester or the upcoming one/(s)

## The Problem

Here's what it's like enrolling for classes:
- [ ] Search for a class on the Course Search and Enroll App
- [ ] Search for every professor's rating online
- [ ] Search for every professor's GPA trends on [MadGrades](https://github.com/madgrades/madgrades.com)
- [ ] Try to make sense of this data
- [ ] Have a Spotted Cow 🍻
- [ ] Repeat for 5 other classes this semester

## The Solution

Here's what you _could_ do instead:
- [ ] Look up a class on this app
- [ ] Have a Spotted Cow 🍻
- [ ] View grade trends and ratings all in one place!

## What I Used
- [MadGrades API](https://github.com/madgrades/api.madgrades.com)
    - Find course by name, e.g., 'Econ 101'
    - Find all GPA data and filter by professor
- UW Madison's [Public Course Search and Enroll API](https://public.enroll.wisc.edu/api/search/v1)
    - Find course in a particular semester
    - Find professors for all sections in one course in a semester
- Good ol' web scraping for everything else