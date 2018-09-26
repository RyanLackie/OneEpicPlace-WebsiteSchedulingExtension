import os, logging, sys
from flask import Flask, render_template, jsonify, request
from flask_session import Session
import pymysql
import pymysql.cursors
from passlib.hash import pbkdf2_sha256
from passlib.utils import to_bytes
from logging.handlers import RotatingFileHandler
import mysql.connector as mariadb_connection
from random import * # This is used in /api/random which is temporary, delete both later
import requests
#some pymysql help
#http://pymysql.readthedocs.io/en/latest/modules/connections.html
#https://recordnotfound.com/PyMySQL-PyMySQL-6326
#https://pymysql.readthedocs.io/en/latest/user/examples.html


#this allows
from flask_cors import CORS

class customFlask(Flask):
    jinja_options = Flask.jinja_options.copy()
    jinja_options.update(dict(

        variable_start_string='%%',
        variable_end_string='%%'))

#configuration
DEBUG = True


# Sets the location of where it pulls the static files and template files
app = customFlask(__name__,
            static_folder = "./dist/static",
            template_folder = "./dist")



# MySQL configurations

myHost = os.getenv('IP', '0.0.0.0')
myPort = (os.getenv('PORT', 49151))
#mainConnection = mysql.connect(host=myHost, unix_socket='/var/run/mysqld/mysqld.sock',port=(os.getenv('PORT', 8080)), user='mastrots1', passwd='password', db='c9')
# connection = pymysql.connect(host=myHost,
#                              user='p_f17_8',
#                              password='password',
#                              db='p_f17_8_db',
#                              charset='utf8mb4',
#                              cursorclass=pymysql.cursors.DictCursor)

# MariaDB Configurations for wyvern server

mariadb_connection = pymysql.connect(
	host=myHost,
    user='p_f17_8',
    password='aj5qyk',
    database='p_f17_8_db',
    charset='utf8mb4')
cursor = mariadb_connection.cursor()


# Allows calls to the api from outside of the original build
# This allows you to run a dev environment on your computer and access the api
#   so you don't have to constantly build for every change.
# See frontend/src/router/index.js
cors = CORS(app, resources={"/api/*": {"origins": "*"}})
            
            
            
# This routes all calls for templates through Vue. If a path is unrecognized it gives a 404 error in NotFound.vue
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template("index.html")



#login modified for vue request.data routes need editing?
@app.route('/api/login', methods=['POST'])
def login():
    req_data = request.get_json()
    if request.method == 'POST':
        app.logger.info("post")
 
    try:
        _name = req_data['username']
        _password = req_data['password']  
        # app.logger.info(_name)
        # app.logger.info(_password)
        # app.logger.info("got this far ......")
        
        if _name and _password:
            #every MYSQL query must be constructed this way
            with connection.cursor() as cursor:
                # return jsonify(message="Before call")
                # sqlname = str("'" + _name + "'")
                # sqlcode = str("SELECT * FROM USER INNER JOIN MEMBER ON USER.USER_NUM = MEMBER.USER_NUM INNER JOIN MEMBERSHIP ON MEMBER.MEM_CODE = MEMBERSHIP.MEM_CODE WHERE USERNAME = " + sqlname)
                # cursor.execute("SELECT MEMBER.PASSWORD, MEMBER.USER_NUM FROM MEMBER INNER JOIN USER ON MEMBER.USER_NUM = USER.USER_NUM INNER JOIN MEMBERSHIP ON MEMBER.MEM_CODE = MEMBERSHIP.MEM_CODE WHERE USERNAME = %s", _name )
                # SELECT * FROM USER INNER JOIN MEMBER ON USER.USER_NUM = MEMBER.USER_NUM INNER JOIN MEMBERSHIP ON MEMBER.MEM_CODE = MEMBERSHIP.MEM_CODE WHERE MEMBER.USERNAME = jimmy
                # cursor.execute("SELECT * FROM USER INNER JOIN MEMBER ON USER.USER_NUM = MEMBER.USER_NUM INNER JOIN MEMBERSHIP ON MEMBER.MEM_CODE = MEMBERSHIP.MEM_CODE")
                # cursor.execute("SELECT MEMBER.PASSWORD, MEMBER.USER_NUM FROM USER INNER JOIN MEMBER ON USER.USER_NUM = MEMBER.MEMBER_NUM INNER JOIN MEMBERSHIP ON MEMBER.MEM_CODE = MEMBERSHIP.MEM_CODE WHERE USERNAME = %s", _name)
                # cursor.execute("SELECT MEMBER.PASSWORD, MEMBER.USER_NUM, MEMBER.MEM_CODE, FROM MEMBER INNER JOIN USER ON MEMBER.USER_NUM = USER.USER_NUM WHERE USERNAME = %s", _name)
                # cursor.execute("SELECT MEMBERSHIP.MEM_CODE, MEMBERSHIP.NAME, MEMBERSHIP.POINTS, MEMBERSHIP.PERIOD_MONTHS, MEMBERSHIP.RECURRING FROM MEMBERSHIP INNER JOIN USER ON MEMBERSHIP.")
                cursor.execute("SELECT MEMBER.PASSWORD, MEMBER.USER_NUM FROM MEMBER INNER JOIN USER ON MEMBER.USER_NUM = USER.USER_NUM WHERE USERNAME = %s", _name)
                # cursor.execute("SELECT MEMBER.PASSWORD, MEMBER.USER_NUM, MEMBERSHIP.MEM_CODE, MEMBERSHIP.NAME, MEMBERSHIP.POINTS, MEMBERSHIP.PERIOD_MONTHS, MEMBERSHIP.RECURRING, USER.FNAME, USER.LNAME, USER.PHONE, USER.EMAIL, USER.SITE FROM MEMBER, MEMBERSHIP, USER WHERE USER.USERNAME = %s AND USER.USER_NUM = MEMBER.USER_NUM AND MEMBER.MEM_CODE = MEMBERSHIP.MEM_CODE", _name)
                # return jsonify(message="After call")
                
                data = cursor.fetchone()
                app.logger.info(data)
                if cursor.rowcount == 0: # This is working fine
                    app.logger.info("user non existent")
                    response = {
                        "success": False,
                        "error": "Username not found"
                    }
                    return jsonify(response)#,401
                else:
                    connection.commit()
                    myPassword = str(data["PASSWORD"])
                    id = data["USER_NUM"]
                    
                    # membershipName = data["NAME"]
                    # membershipPoints = data["POINTS"]
                    # membershipPeriod = data["PERIOD_MONTHS"]
                    # membershipRecurring = data["RECURRING"]
                    
                    app.logger.info(myPassword)
                    app.logger.info(id)
                    myPassword = to_bytes(myPassword,'utf-8')
                    
                    if pbkdf2_sha256.verify(_password, myPassword):
                        app.logger.info("it worked")
                        # session['username'] = _name # NOW GETTING AN ERROR HERE
                        # session['id'] = id
                        response = {
                            "success": True,
                            "username": _name,
                            "password": myPassword
                        }
                        return  jsonify(response)
                            
                    else:
                        app.logger.info("it did not work")
                        response = {
                            "success": False,
                            "error": "Incorrect password"
                        }
                        return jsonify(response)#,401
    except Exception as e:
        e = sys.exc_info()[0]
        app.logger.info(str(e))
        response = {
            "success": False,
            "error": "There was an internal error"
        }
        return jsonify(message='another error'),401






# This is an example of an api call, delete this later along with "from random import *"
@app.route('/api/random')
def random_number():
    response = {
        'randomNumber': randint(1, 100)
    }
    return jsonify(response)
# End of example

# Test examples
@app.route('/api/query-example')
def query_example():
    response = {
        'todo': "testing"
    }
    return jsonify(response)

@app.route('/api/form-example')
def form_example():
    return 'Todo...'

@app.route('/api/json', methods=['POST'])
def json():
    req_data = request.get_json()
    
    username = req_data['username']
    password = req_data['password']
    response = {
        "username": username,
        "password": password
    }
    return jsonify(response)
# End test examples



# Sets the run variables for when you run this file
if __name__ == "__main__":
    
    # initialize the log handler
    logHandler = RotatingFileHandler('info.log', maxBytes=1000, backupCount=1)
    # set the log handler level
    logHandler.setLevel(logging.DEBUG)
    app.logger.addHandler(logHandler)
     # set the app logger level
    app.logger.setLevel(logging.DEBUG)
    app.logger.info("up and running...........")
    app.run(debug=True,use_reloader=False,host=os.getenv('IP', '0.0.0.0'),port=int(os.getenv('PORT',49151)))
