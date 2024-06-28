import React, { useState, useEffect, useCallback } from 'react';
import ScrollToTopButton from '../utils/ScrollToTopButton';

const FilteredDataDisplay = ({ outputData }) => {
  const [searchValue, setSearchValue] = useState('');
  const [filterField, setFilterField] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedData, setSelectedData] = useState([]);
  const [selectAllText, setSelectAllText] = useState('Select All');
  const [sortOrder, setSortOrder] = useState(null);

  // const convertToUTC = (dateString) => {
  //   const date = new Date(dateString);
  //   return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString();
  // };

  const convertToUTC = (date) => {
    const utcDate = new Date(date);
    return utcDate.toISOString();
  };

  const filterData = useCallback((data) => {
    let filteredData = data;

    if (searchValue && filterField) {
      filteredData = filteredData.filter((item) => {
        const fieldValue = typeof item[filterField] === 'string' ? item[filterField] : String(item[filterField]);
        return fieldValue !== "" && fieldValue.toLowerCase().includes(searchValue.toLowerCase());
      });
    }

    if (startDate && endDate) {      

      const start = convertToUTC(startDate);
      const end = convertToUTC(endDate);

      filteredData = filteredData.filter((item) => {
       
        const itemDate = convertToUTC(new Date(item['currentDateTime']));      

        return itemDate >= start && itemDate <= end;
      });
    }

    if (sortOrder && filterField) {
      filteredData = filteredData.slice().sort((a, b) => {
        // Check if filterField is a number
        if (typeof a[filterField] === 'number' && typeof b[filterField] === 'number') {
          return sortOrder === 'asc' ? a[filterField] - b[filterField] : b[filterField] - a[filterField];
        } else if (filterField === 'currentDateTime') {
          // Convert values to Date objects for comparison if filterField is a date
          const dateA = new Date(a[filterField]);
          const dateB = new Date(b[filterField]);
          return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        } else {
          // Otherwise, compare as strings
          return sortOrder === 'asc'
            ? String(a[filterField]).localeCompare(String(b[filterField]))
            : String(b[filterField]).localeCompare(String(a[filterField]));
        }
      });
    }

    return filteredData;
  }, [searchValue, filterField, startDate, endDate, sortOrder]);

  useEffect(() => {
    // Reset selected data when changing filters or dates
    setSelectedData([]);
    setSelectAllText('Select All');
  }, [searchValue, filterField, startDate, endDate, outputData]);

  const renderFilteredData = () => {
    const filteredData = filterData(outputData);
    return (
      <div className='dekrypted-container'>
        {filteredData.map((outputItem, index) => (
          <div className='dekrypted' key={index}>
            <div className='filters' onClick={() => toggleSelect(index)}>
              <input
                type="checkbox"
                style={{ cursor: 'pointer' }}
                className='selected'
                checked={selectedData.includes(index)}
                onChange={() => toggleSelect(index)}
              />
              <h3>Data #{index + 1}</h3>
            </div>
            <ul className='no-markers'>
              {Object.entries(outputItem).map(([field, value]) => (
                <li key={field} style={getFieldStyle(field, value)}>
                  {field}: {formatFieldValue(field, value)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  const getFieldStyle = (field, value) => {
    if (field === 'orderNumber') {
      return { fontWeight: 'bold' };
    }
    if (field === 'currentDateTime') {
      return { color: 'blue' };
    }
    return {};
  };

  const formatFieldValue = (field, value) => {
    if (field === 'currentDateTime') {
      let userTimeZone = null;
      try {
        userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      } catch (error) {
        console.error('Failed to retrieve user time zone:', error);
      }
  
      const formattedDate = userTimeZone ? new Date(value.toLocaleString([], { timeZone: userTimeZone })).toLocaleString() : '';
  
      return (
        <strong translate="no">
          <br /> UTC {value}
          <br /> Current local time: {formattedDate || 'Unable to determine local time'}
          {/* <br /> GMT+3: {new Date(value).toLocaleString('ru-RU', {
            timeZone: 'Europe/Moscow',
            formatMatcher: 'best fit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })} */}
        </strong>
      );
    }
    return value;
  };
  
  const toggleSelect = (index) => {
    if (selectedData.includes(index)) {
      setSelectedData(selectedData.filter((item) => item !== index));
    } else {
      setSelectedData([...selectedData, index]);
    }
    setSelectAllText('Deselect All');
  };

  const handleSelectAll = () => {
    const filteredData = filterData(outputData);
    if (selectAllText === 'Select All') {
      setSelectedData(filteredData.map((_, index) => index));
      setSelectAllText('Deselect All');
    } else {
      setSelectedData([]);
      setSelectAllText('Select All');
    }
  };

  const copySelectedDataToClipboard = () => {
    const selectedItems = selectedData.map((index) => {
      const item = outputData[index];
      const filteredItem = {};
      for (const [key, value] of Object.entries(item)) {
        if (value !== '') {
          filteredItem[key] = value;
        }
      }
      return filteredItem;
    });
    const clipboardText = selectedItems
      .map((item) => Object.entries(item).map(([key, value]) => `${key}:${value}`).join(','))
      .join(';\n');
    navigator.clipboard.writeText(clipboardText)
      .then(() => alert('Selected data copied to clipboard'))
      .catch((error) => alert('⚠️Failed to copy selected data to clipboard: ', error));
  };

  const Reset = () => {
    setEndDate('');
    setStartDate('');
    setSearchValue('');
    setFilterField('');
    setSortOrder(null);
  };

  return ( 
   <> 
     <div className='filters'> 
      {filterField && (
        <>
        <input
          type="search"
          className='form-input'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Filter..."
        />  
        <button className='form-input' onClick={() => setSortOrder('asc')}>⏫Sort</button>
        <button className='form-input' onClick={() => setSortOrder('desc')}>⏬Sort</button>
        </>
      )}
      <select className='form-input' value={filterField} onChange={(e) => setFilterField(e.target.value)}>
        <option value="">Select Filter Field</option>
        {outputData.length > 0 &&
          Object.keys(outputData[0]).map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))
        }
      </select>

      <label>
        <b>Start Date:</b>
        <input
          type="date"
          className='form-input'
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>
      <label>
        <b>End Date:</b>
        <input
          type="date"
          className='form-input'
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>
      {(searchValue !== "" || startDate !== "" || endDate !== "" || filterField !== "") && 
        <button className='back-button selected' onClick={Reset}>Reset Filter</button>
      }      
     </div>  
      <div className='filters'>
        {outputData && filterData(outputData).length > 0 && (
          <button className='back-button selected' onClick={handleSelectAll}>{selectAllText}</button>
        )}
        {selectedData && selectedData.length > 0 && (
          <button className='back-button selected' onClick={copySelectedDataToClipboard}>Copy Selected to Clipboard</button>
        )}
      </div>  
        <div className='dekrypted-container'>
          {renderFilteredData()}        
        </div>
         <ScrollToTopButton />
   </>
  );
};

export default FilteredDataDisplay;