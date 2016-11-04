from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import *
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.engine.url import URL
from sqlalchemy.orm import relationship

# Fetch Database Settings
import settings

# Instantiate declarative base
DeclarativeBase = declarative_base()


def db_connect():
    '''Returns a connection and a metadata object'''
    # Password field is not being used - for later
    return create_engine(URL(**settings.DATABASE))


def create_nvd_tables(engine):
    """
    Create tables with a postgres connection for NVD Database
    :param engine:
    :return:
    """
    DeclarativeBase.metadata.create_all(engine)


class CpeItem(DeclarativeBase):
    """Sqlalchemy model for NVD CPEs"""
    __tablename__ = "CpeItem"

    id = Column(INTEGER, primary_key=True)
    cpe_id = Column("cpeid", String, nullable=False)


class CveItem(DeclarativeBase):
    """Sqlalchemy model for NVD CPEs"""
    __tablename__ = "CveItem"

    id = Column(INTEGER, primary_key=True)
    cve_id = Column("cveid", String, nullable=False)
    configuration_id = Column("configuration_id", String)
    software_list = Column("software_list", ARRAY(String, dimensions=1))
    publish_date = Column("publish_date", DateTime)
    modified_date = Column("modified_date", DateTime)
    Base_Score = Column("base_score", FLOAT)
    Base_Access_Vector = Column("access_vector", String)
    Base_Access_Complexity = Column("access_complexity", String)
    Base_Authentication = Column("Authentication", String)
    Base_Confidentiality_Impact = Column("confidentiality_impact", String)
    Base_Integrity_Impact = Column("integrity_impact", String)
    Base_Availability_Impact = Column("availability_impact", String)
    Base_Source = Column("source", String)
    Base_generation = Column("base_generation_date", DateTime)
    cwe_id = Column("cwe_id", ARRAY(String, dimensions=1))
    vulnerability_source = Column("vulnerability_source", ARRAY(String, dimensions=1))
    vulnerability_source_reference = Column("vulnerability_source_reference", ARRAY(String, dimensions=1))
    summary = Column("summary", TEXT)




if __name__ == '__main__':
    engine = db_connect()
    print(engine)
    create_nvd_tables(engine=engine)


