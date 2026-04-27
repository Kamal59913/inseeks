import React from 'react';
import styles from './searchBar.module.scss';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ShortSearchbarHpAlt() {
  return (
    <div className={styles.AccountsInformationTaglineshort}>
      <FontAwesomeIcon icon={faSearch} className={styles.icon} />
      <input
        type="text"
        name="Occupation"
        placeholder="Search in Socials..."
        id={styles.searchbarshorthp}
      />
      <br />
      <label htmlFor={styles.searchbarshorthp} className={styles.filtershortHp}>
        FILTERS
      </label>
      <br />
    </div>
  );
}
