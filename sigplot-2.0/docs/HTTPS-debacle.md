# **SigPlot Demo App**
This website is not fully functional on GitHub as of Tues, August 8th, 2017.

# **The Problem**
### Jsbin was configured to run on http (not https), and GitHub hosts on https.
Jsbin requires a premium plan for the use of embedded https.

GitHub requires a custom domain name to enable interactions over http.
# **Possible Solutions**
### Use a jsbin premium account.
Currently the jsbin account is connected to Stephanie Hickman's personal GitHub
account. Once this is moved over, the username and password information will be
found in here. You will need to change every url in the code of each bin from
http to https. Then, in the examples folder of the website directory, paste in
the new link the bin that can be copied by clicking the "share" button, selecting
"snapshot" and both "js" and "output". Copy the embed link and paste where current
iframe is in each example.
### Use a custom domain name for the GitHub page.
You will need to go into settings (be an admin) and change the domain name. You
will also have to set up what's called a c-record in our domain config, that will
point demo.axiosengineering.com to Axios-Engineering.github.io. This also requires
special permissions.
