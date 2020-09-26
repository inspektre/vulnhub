"""Config

    Write a default database configuration for a user.
"""
import json
import os


# Private variable to store Configuration
_config_template = dict()
_config_template["DATABASE"] = dict()
_config_template["DATABASE"]["drivername"] = "postgres"
_config_template["DATABASE"]["host"] = "localhost"
_config_template["DATABASE"]["port"] = "5432"
_config_template["DATABASE"]["username"] = "postgres"
_config_template["DATABASE"]["password"] = "password"
_config_template["DATABASE"]["database"] = "nvddb"


# Static directory location for configuration storage
_directory_path = os.path.expanduser("~") + "/.vulnhub"


# Static file path for saving configuration
_file_path = _directory_path + '/dbconfig.json'


def generate_config():
    """
    Write a JSON configuration file in user's directory to save configuration for future connections.
    :return: None
    """
    print("Writing configuration to: {0}".format(_file_path))
    if not os.path.exists(_directory_path):
        os.makedirs(_directory_path)
    with open(_file_path, 'w') as config_writer:
        json.dump(_config_template, config_writer)
    print(_config_template)
