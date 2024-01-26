import os

from flask import Flask, render_template, redirect, url_for, session, request, jsonify
from flask_discord import DiscordOAuth2Session, requires_authorization, Unauthorized
import requests

from dotenv import load_dotenv
import pymongo
from pymongo import MongoClient

load_dotenv()
MONGODB_TOKEN = os.getenv("MONGODB_TOKEN")
# # login into DataBases
cluster = pymongo.MongoClient(MONGODB_TOKEN)
db = cluster.NorthStarDB
setting = db.setting
# user = db.users


app = Flask(__name__)

app.secret_key = os.urandom(24)
# OAuth2 must make use of HTTPS in production environment.
# os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"      # !! Only in development environment.

app.config["DISCORD_CLIENT_ID"] = 929856180984111167                                    # Discord client ID.
app.config["DISCORD_CLIENT_SECRET"] = os.environ.get("DISCORD_CLIENT_SECRET")           # Discord client secret.
app.config["DISCORD_REDIRECT_URI"] = "https://northstargalaxy.azurewebsites.net/callback"                 # URL to your callback endpoint.
# app.config["DISCORD_REDIRECT_URI"] = "http://localhost:5000/callback" 
app.config["DISCORD_BOT_TOKEN"] = ""                    # Required to access BOT resources.

discord = DiscordOAuth2Session(app)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/login/")
def login():
    return discord.create_session(scope=['identify', 'guilds'])

@app.route("/logout/")
def logout():
    discord.revoke()
    return redirect(url_for('home'))

@app.route("/callback/")
def callback():
    data = discord.callback()
    return redirect(url_for('.dashboard'))

@app.route('/dashboard')
@requires_authorization
def dashboard():
    # Retrieve user information from the session
    user = discord.fetch_user()
    # Fetch a list of guilds (servers) where the user has the "Manage Server" permission
    manage_server_guilds = [guild for guild in discord.fetch_guilds() if guild.permissions.manage_guild]

    return render_template('dashboard.html', user=user, guilds = manage_server_guilds)


@app.route("/select-guild/", methods=['POST'])
@requires_authorization
def select_guild():
    # Data Sorting
    data = request.json
    guild_index = int(data.get('guild_index'))
    user = discord.fetch_user()
    manage_server_guilds = [guild for guild in discord.fetch_guilds() if guild.permissions.manage_guild]
    guild_id = manage_server_guilds[guild_index].id


    # # Update MongoDB here using pymongo
    query_id = {"_id": str(guild_id)}
    query = setting.find_one(query_id)
    switches_data = query.get('switches') if query else None
    return jsonify({'message': 'selectGuild function have been executed.', 'switches': switches_data})


@app.route("/update-mongodb/", methods=['POST'])
@requires_authorization
def update_mongodb():
    # Data Sorting
    data = request.json
    guild_index = int(data.get('guild_index'))
    manage_server_guilds = [guild for guild in discord.fetch_guilds() if guild.permissions.manage_guild]
    guild_id = manage_server_guilds[guild_index].id

    # # Update MongoDB here using pymongo
    query_id = {"_id": str(guild_id)}

    for k,v in data.items():
        if (k != "guild_index"):
            setting.find_one_and_update(
            query_id,
            {"$set": {f"switches.{k}": v}},
        )


    return jsonify({'message': 'Updated the Database.'})


@app.errorhandler(Unauthorized)
def redirect_unauthorized(e):
    print("error happend")
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run(debug=True)
