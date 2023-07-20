import requests
import os


def access_private_profile(profile_id, access_token):
    url = f"https://graph.instagram.com/{profile_id}?fields=id,username&access_token={access_token}"
    response = requests.get(url)
    if response.status_code == 200:
        profile_data = response.json()
        username = profile_data["username"]
        print(f"Congratulations! You have accessed the private profile of @{username}.")
        download_pictures(username, access_token)
    else:
        print("Access denied. The Instagram guardians are vigilant.")


def download_pictures(username, access_token):
    url = f"https://graph.instagram.com/{username}/media?access_token={access_token}"
    response = requests.get(url)
    if response.status_code == 200:
        media_data = response.json()
        for index, media in enumerate(media_data["data"]):
            media_url = media["media_url"]
            file_name = f"{username}_{index+1}.jpg"
            download_file(media_url, file_name)
        print("Pictures downloaded successfully.")
    else:
        print("Unable to fetch pictures. The Instagram guardians are onto us.")


def download_file(url, file_name):
    response = requests.get(url)
    if response.status_code == 200:
        with open(file_name, "wb") as file:
            file.write(response.content)
    else:
        print(f"Failed to download {file_name}. The Instagram guardians are watching.")


# Usage: Replace <profile_id> and <access_token> with appropriate values
access_private_profile("<profile_id>", "<access_token>")
