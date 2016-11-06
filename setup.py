from setuptools import setup, find_packages
from os import path


here = path.abspath(path.dirname(__file__))
_vulnhub_version = '0.0.001'

install_requires=[
    'wget',
    'BeautifulSoup4',
    'lxml',
    'sqlalchemy',
    'psycopg2',
    'docopt',
    'xmltodict',
    'plotly',
    'pylint'
    ]

tests_require=[
    'pytest',
    'mock'
    ]

setup(
    name='vulnhub',
    version=_vulnhub_version,
    description='National Vulnerability Database - Store, Search and Compute',
    long_description='',
    url='https://github.com/UShan89/vulnhub',
    author='Sai Uday Shankar Korlimarla',
    author_email='skorlimarla@unomaha.edu',
    license='GNU General Public License v2 or later (GPLv2+)',

    classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: System Administrators',
        'Topic :: System :: Software Administration',
        'Topic :: Software Development :: Security Tools',
        'License :: OSI Approved :: GNU General Public License v2 or later (GPLv2+)',
        'Programming Language :: Python :: 3.5',
        'Environment :: Console',
        ],

    keywords='vulnerability, CPE, CVE, security, nvd',
    packages=find_packages(),
    install_requires=install_requires,
    tests_require=tests_require,
    extras_require={
        'tests': install_requires + tests_require,
        },

    entry_points={'console_scripts': ['vulnhub=vulnhub.vulnhub:main']},
    test_suite='py.test',

    zip_safe=False,
)
