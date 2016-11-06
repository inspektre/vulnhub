""" Datapipeline

    Main module to directly access Schema and perform all database operations
"""
import sys
from sqlalchemy.exc import ProgrammingError
from sqlalchemy.orm import sessionmaker
from vulnhub.database.schema import CveItem, CpeItem
from vulnhub.database.schema import DeclarativeBase
from vulnhub.database.schema import db_connect, create_nvd_tables


# Global variable that connection to database and return an ORM Object from Schema
engine = db_connect()


def drop_cpes():
    """
    Drop CPEs in the database
    :return: None
    """
    try:
        DeclarativeBase.metadata.tables['CpeItem'].drop(engine)
    except ProgrammingError:
        print("[-] Table may have been dropped already!, Try --dbinit")
    finally:
        DeclarativeBase.metadata.tables['CpeItem'].create(engine)


def drop_cves():
    """
    Drop CVEs  in the database
    :return: None
    """
    try:
        DeclarativeBase.metadata.tables['CveItem'].drop(engine)
    except ProgrammingError:
        print("[-] Table may have been dropped already! Try --dbinit")
    finally:
        DeclarativeBase.metadata.tables['CveItem'].create(engine)


def initialize():
    """
    Drop all tables with the ORM metadata
    :return: None
    """
    print("[+] Dropping tables")
    try:
        DeclarativeBase.metadata.drop_all(engine)
    except ProgrammingError:
        print("[-] Table(s) may have been dropped already!")
    print("[+] Creating tables")
    DeclarativeBase.metadata.create_all(engine)


class DataPipeline(object):
    """pipeline for storing scraped items in the database"""
    def __init__(self):
        """
        Initializes database connection and sessionmaker.
        Creates deals table.
        """
        engine = db_connect()
        create_nvd_tables(engine)
        self._Session = sessionmaker(bind=engine)

    def process_cpe_many(self, cpe_entries):
        """Save deals in the database.

        This method is called for every item pipeline component.

        """
        drop_cpes()
        session = self._Session()

        print("[+] Bulk Insert initated")
        for cpe_entry in cpe_entries:
            cpe_item = CpeItem(**cpe_entry)
            session.add(cpe_item)

        try:
            session.commit()
        except:
            session.rollback()
            raise
        finally:
            session.close()
        return

    def process_cve_many(self, cve_entries):
        """Save deals in the database.

        This method is called for every item pipeline component.

        """
        print('[+] Bulk processing started')
        session = self._Session()
        for cve_entry in cve_entries:
            try:
                cve_item = CveItem(**cve_entry)
                if self.query_cve(cve_entry['cve_id'], 1):
                    # Update existing by CVE
                    session.query(CveItem).filter(CveItem.cve_id == cve_entry['cve_id']).\
                        update({
                                    CveItem.software_list: cve_entry['software_list'],
                                    CveItem.published_date: cve_entry['published_date'],
                                    CveItem.modified_date: cve_entry['modified'],
                                    CveItem.Base_Score: cve_entry['Base_score'],
                                    CveItem.Base_Access_Vector : cve_entry['Base_Access_Vector'],
                                    CveItem.Base_Access_Complexity: cve_entry['Nase_Access_Complexity'],
                                    CveItem.Base_Authentication: cve_entry['Base_Authentication'],
                                    CveItem.Base_Confidentiality_Impact: cve_entry['Base_Confidentiality_Impact'],
                                    CveItem.Base_Integrity_Impact: cve_entry['Base_Integrity_Impact'],
                                    CveItem.Base_Availability_Impact: cve_entry['Base_Availability_Impact'],
                                    CveItem.Base_Source: cve_entry['Base_Source'],
                                    CveItem.Base_generation: cve_entry['Base_generation'],
                                    CveItem.cwe_id : cve_entry['cwe_id'],
                                    CveItem.vulnerability_source: cve_entry['vulnerability_source'],
                                    CveItem.vulnerability_source_reference: cve_entry['vulnerability_source_reference'],
                                    CveItem.summary: cve_entry['']
                                })
                else:
                    session.add(cve_item)
            except KeyError as e:
                print(cve_entry)
                sys.exit(0)

        print('[+] Bulk processing done')

        try:
            session.commit()
        except:
            session.rollback()
            raise
        finally:
            session.close()
        return

    def query_cpe(self, cpe_entry, search_limit):
        """
        Query database for CPEs
        :param cpe_entry: CPE URI in the NVD CVE table array
        :param search_limit: Numeric quantity to limit search results
        :return: SQLAlchemy Object with results
        """
        session = self._Session()
        query_result = session.query(CveItem).filter(CveItem.software_list.any(cpe_entry)).limit(search_limit).all()
        session.close()
        return query_result

    def query_cve(self, cve_entry, search_limit):
        """

        :param cve_entry: CVE Identifier to search on for CPE and etc.
        :param search_limit: Numeric quantity to limit search results
        :return: SQLAlchemy Object with results
        """
        session = self._Session()
        query_result = session.query(CveItem).filter(CveItem.cve_id == cve_entry).limit(search_limit).all()
        session.close()
        return query_result

    def query_year(self, cve_year, search_limit):
        """

        :param cve_year: Numeric quantity as year to search for CVEs
        :param search_limit: Numeric quantity to limit search results
        :return: SQLAlchemy Object with results
        """
        session = self._Session()
        query_result = session.query(CveItem).filter(CveItem.cve_id.like(cve_year)).limit(search_limit).all()
        session.close()
        return  query_result
