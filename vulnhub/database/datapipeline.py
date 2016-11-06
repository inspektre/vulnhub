import time

from sqlalchemy.exc import ProgrammingError
from sqlalchemy.orm import sessionmaker
from vulnhub.database.schema import CveItem, CpeItem
from vulnhub.database.schema import DeclarativeBase
from vulnhub.database.schema import db_connect, create_nvd_tables

engine = db_connect()


def drop_cpes():
    try:
        DeclarativeBase.metadata.tables['CpeItem'].drop(engine)
    except ProgrammingError:
        print("[-] Table may have been dropped already!, Try --dbinit")
    finally:
        DeclarativeBase.metadata.tables['CpeItem'].create(engine)


def drop_cves():
    try:
        DeclarativeBase.metadata.tables['CveItem'].drop(engine)
    except ProgrammingError:
        print("[-] Table may have been dropped already! Try --dbinit")
    finally:
        DeclarativeBase.metadata.tables['CveItem'].create(engine)


def initialize():
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
            cve_item = CveItem(**cve_entry)
            if self.query_cve(cve_entry['cve_id'], 1):
                # Update existing by CVE
                session.query(CveItem).filter(CveItem.cve_id == cve_entry['cve_id']).\
                    update({
                                CveItem.software_list: cve_entry['software_list'],
                                CveItem.configuration_id: cve_entry['configuration_id'],
                                CveItem.publish_date: cve_entry['publish_date'],
                                CveItem.modified_date: cve_entry['modified'],
                                CveItem.Base_Score : cve_entry['Base_score'],
                                CveItem.Base_Access_Vector : cve_entry['Base_Access_Vector'],
                                CveItem.Base_Access_Complexity : cve_entry['Nase_Access_Complexity'],
                                CveItem.Base_Authentication : cve_entry['Base_Authentication'],
                                CveItem.Base_Confidentiality_Impact : cve_entry['Base_Confidentiality_Impact'],
                                CveItem.Base_Integrity_Impact : cve_entry['Base_Integrity_Impact'],
                                CveItem.Base_Availability_Impact : cve_entry['Base_Availability_Impact'],
                                CveItem.Base_Source : cve_entry['Base_Source'],
                                CveItem.Base_generation : cve_entry['Base_generation'],
                                CveItem.cwe_id : cve_entry['cwe_id'],
                                CveItem.vulnerability_source : cve_entry['vulnerability_source'],
                                CveItem.vulnerability_source_reference : cve_entry['vulnerability_source_reference'],
                                CveItem.summary : cve_entry['']
                            })
            else:
                session.add(cve_item)

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
        session = self._Session()
        query_result = session.query(CveItem).filter(CveItem.software_list.any(cpe_entry)).limit(search_limit).all()
        return query_result

    def query_cve(self, cve_entry, search_limit):
        session = self._Session()
        query_result = session.query(CveItem).filter(CveItem.cve_id == cve_entry).limit(search_limit).all()
        return query_result

    def query_year(self, cve_year, search_limit):
        session = self._Session()
        query_result = session.query(CveItem).filter(CveItem.cve_id.like(cve_year)).limit(search_limit).all()
        return  query_result


def test_cpe_insert():
    pipeline = DataPipeline()

    cpe_entry = dict()
    cpe_entry['cpe_id'] = 'CPE:/a'
    cpe_entry['cves'] = ['1', '2', 'apple']
    # cpe_entry['title'] = 'test'
    # cpe_entry['product_catalog'] = 'test'
    # cpe_entry['vendor_website'] = 'http://'
    # cpe_entry['modification_date'] = time.strftime("%m-%d-%Y")
    # cpe_entry['status'] = "Done"
    # cpe_entry['nvd_id'] = 1111

    pipeline.process_cpe(cpe_entry)


def test_cve_insert():
    pipeline = DataPipeline()

    cve_item = dict()

    cve_item['cve_id'] = 'CVE-1234-1124'
    cve_item['configuration_id'] = "Config"
    cve_item['software_list'] = ['abcd', 'efgh']
    cve_item['publish_date'] = time.strftime("%m-%d-%Y")
    cve_item['modified_date'] = time.strftime("%m-%d-%Y")
    cve_item['Base_Score'] = 4.3
    cve_item['Base_Access_Vector'] = "None"
    cve_item['Base_Access_Complexity'] = "None"
    cve_item['Base_Authentication'] = "None"
    cve_item['Base_Confidentiality_Impact'] = "None"
    cve_item['Base_Integrity_Impact'] = "None"
    cve_item['Base_Availability_Impact'] = "None"
    cve_item['Base_Source'] = "None"
    cve_item['Base_generation'] = time.strftime("%m-%d-%Y")
    cve_item['cwe_id']  = ['123', 'abc']
    cve_item['vulnerability_source'] = ['123', 'abc']
    cve_item['vulnerability_source_reference'] = ['123', '123ab']
    cve_item['summary'] = "s 3 14234 BACDEFSDFD r234n aple"

    pipeline.process_cve(cve_item)


if __name__ == '__main__':
    # pipeline.process_cve(cpe_item)
    # pipeline.process_cpe(cpe_item)
    print("Import DataPipeline for data processing")
    test_cpe_insert()
    test_cve_insert()

