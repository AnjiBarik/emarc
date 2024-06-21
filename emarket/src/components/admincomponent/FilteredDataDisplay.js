import React, { useState, useEffect, useCallback } from 'react';
import ScrollToTopButton from '../utils/ScrollToTopButton';

const FilteredDataDisplay = ({ outputData }) => {
  const [searchValue, setSearchValue] = useState('');
  const [filterField, setFilterField] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedData, setSelectedData] = useState([]);
  const [selectAllText, setSelectAllText] = useState('Select All');

  const convertToUTC = (dateString) => {
    const date = new Date(dateString);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString();
  };

  const filterData = useCallback((data) => {
    if (!searchValue && !filterField && !startDate && !endDate) {
      return data;
    }

    return data.filter((item) => {
      let isMatch = true;

      if (searchValue && filterField) {
        const fieldValue = typeof item[filterField] === 'string' ? item[filterField] : String(item[filterField]);
        isMatch = fieldValue !== "" && fieldValue.toLowerCase().includes(searchValue.toLowerCase());
      }

      if (isMatch && startDate && endDate) {
        const itemDate = new Date(item['currentDateTime']);
        const start = convertToUTC(startDate);
        const end = convertToUTC(endDate);
        isMatch = itemDate >= start && itemDate <= end;
      }

      return isMatch;
    });
  }, [searchValue, filterField, startDate, endDate]);

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
              <h3>Decrypted Data #{index + 1}</h3>
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
      return (
        <strong translate="no">
          {value} <br /> UTC ISO {convertToUTC(value)}
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
    setSelectAllText('Deselect All');//!
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
  };

  return (
   <>
     <div className='filters'>
      <input
        type="search"
        className='form-input'
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Filter..."
      />
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
      {(searchValue !== "" || startDate !== "" || endDate !== "") && 
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



// import React, { useState, useEffect, useCallback } from 'react';

// const FilteredDataDisplay = ({ outputData }) => {
//   const [searchValue, setSearchValue] = useState('');
//   const [filterField, setFilterField] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [selectedData, setSelectedData] = useState([]);
//   const [selectAllText, setSelectAllText] = useState('Select All');

//   const convertToUTC = (dateString) => {
//     const date = new Date(dateString);
//     return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString();
//   };

//   const filterData = useCallback((data) => {
//     if (!searchValue && !filterField && !startDate && !endDate) {
//       return data;
//     }

//     return data.filter((item) => {
//       let isMatch = true;

//       if (searchValue && filterField) {
//         const fieldValue = typeof item[filterField] === 'string' ? item[filterField] : String(item[filterField]);
//         isMatch = fieldValue !== "" && fieldValue.toLowerCase().includes(searchValue.toLowerCase());
//       }

//       if (isMatch && startDate && endDate) {
//         const itemDate = new Date(item['currentDateTime']);
//         const start = convertToUTC(startDate);
//         const end = convertToUTC(endDate);
//         isMatch = itemDate >= start && itemDate <= end;
//       }

//       return isMatch;
//     });
//   }, [searchValue, filterField, startDate, endDate]);

//   useEffect(() => {
//     const filteredData = filterData(outputData);
//     setSelectedData(filteredData.map((item, index) => index));
//   }, [searchValue, filterField, startDate, endDate, filterData, outputData]);

//   const renderFilteredData = () => {
//     const filteredData = filterData(outputData);
//     return (
//       <div className='dekrypted-container'>
//         {filteredData.map((outputItem, index) => (
//           <div className='dekrypted' key={index}>
//             <div className='filters'>
//               <input
//                 type="checkbox"
//                 style={{ cursor: 'pointer' }}
//                 className='selected'
//                 checked={selectedData.includes(index)}
//                 onChange={() => toggleSelect(index)}
//               />
//               <h3>Decrypted Data #{index + 1}</h3>
//             </div>
//             <ul className='no-markers'>
//               {Object.entries(outputItem).map(([field, value]) => (
//                 <li key={field} style={getFieldStyle(field, value)}>
//                   {field}: {formatFieldValue(field, value)}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const getFieldStyle = (field, value) => {
//     if (field === 'orderNumber') {
//       return { fontWeight: 'bold' };
//     }
//     if (field === 'currentDateTime') {
//       return { color: 'blue' };
//     }
//     return {};
//   };

//   const formatFieldValue = (field, value) => {
//     if (field === 'currentDateTime') {
//       return (
//         <strong translate="no">
//           {value} <br /> UTC ISO {convertToUTC(value)}
//         </strong>
//       );
//     }
//     return value;
//   };

//   const toggleSelect = (index) => {
//     if (selectedData.includes(index)) {
//       setSelectedData(selectedData.filter((item) => item !== index));
//     } else {
//       setSelectedData([...selectedData, index]);
//     }
//   };

//   const handleSelectAll = () => {
//     if (selectAllText === 'Select All') {
//       const allFilteredIndexes = filterData(outputData).map((item, index) => index);
//       setSelectedData(allFilteredIndexes);
//       setSelectAllText('Deselect All');
//     } else {
//       setSelectedData([]);
//       setSelectAllText('Select All');
//     }
//   };

//   const copySelectedDataToClipboard = () => {
//     const selectedItems = selectedData.map((index) => {
//       const item = outputData[index];
//       const filteredItem = {};
//       for (const [key, value] of Object.entries(item)) {
//         if (value !== '') {
//           filteredItem[key] = value;
//         }
//       }
//       return filteredItem;
//     });
//     const clipboardText = selectedItems
//       .map((item) => Object.entries(item).map(([key, value]) => `${key}:${value}`).join(','))
//       .join(';\n');
//     navigator.clipboard.writeText(clipboardText)
//       .then(() => alert('Selected data copied to clipboard'))
//       .catch((error) => alert('⚠️Failed to copy selected data to clipboard: ', error));
//   };

//   const Reset = () => {
//     setEndDate('');
//     setStartDate('');
//     setSearchValue('');
//   };

//   return (
//     <div className='filters'>
//       <input
//         type="search"
//         className='form-input'
//         value={searchValue}
//         onChange={(e) => setSearchValue(e.target.value)}
//         placeholder="Filter..."
//       />
//       <select className='form-input' value={filterField} onChange={(e) => setFilterField(e.target.value)}>
//         <option value="">Select Filter Field</option>
//         {outputData.length > 0 &&
//           Object.keys(outputData[0]).map((field) => (
//             <option key={field} value={field}>
//               {field}
//             </option>
//           ))
//         }
//       </select>

//       <label>
//         <b>Start Date:</b>
//         <input
//           type="date"
//           className='form-input'
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//         />
//       </label>
//       <label>
//         <b>End Date:</b>
//         <input
//           type="date"
//           className='form-input'
//           value={endDate}
//           onChange={(e) => setEndDate(e.target.value)}
//         />
//       </label>
//       {(searchValue !== "" || startDate !== "" || endDate !== "") && 
//         <button className='back-button selected' onClick={Reset}>Reset Filter</button>
//       }
//       <div className='filters'>
//         {outputData && filterData(outputData).length > 0 && (
//           <button className='back-button selected' onClick={handleSelectAll}>{selectAllText}</button>
//         )}
//         {selectedData && selectedData.length > 0 && (
//           <button className='back-button selected' onClick={copySelectedDataToClipboard}>Copy Selected to Clipboard</button>
//         )}
//         <div className='dekrypted-container'>
//           {renderFilteredData()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FilteredDataDisplay;




// import React, { useState } from 'react';

// const FilteredDataDisplay = ({ outputData }) => {
//   const [searchValue, setSearchValue] = useState('');
//   const [filterField, setFilterField] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [selectedData, setSelectedData] = useState([]);
//   const [selectAllText, setSelectAllText] = useState('Select All');

//   const convertToUTC = (dateString) => {
//     const date = new Date(dateString);
//     return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString();
//   };

//   const filterData = (data) => {
//     if (!searchValue && !filterField && !startDate && !endDate) {
//       return data;
//     }

//     return data.filter((item) => {
//       let isMatch = true;

//       if (searchValue && filterField) {
//         const fieldValue = typeof item[filterField] === 'string' ? item[filterField] : String(item[filterField]);
//         isMatch = fieldValue !== "" && fieldValue.toLowerCase().includes(searchValue.toLowerCase());
//       }

//       if (isMatch && startDate && endDate) {
//         const itemDate = new Date(item['currentDateTime']);
//         const start = convertToUTC(startDate);
//         const end = convertToUTC(endDate);
//         isMatch = itemDate >= start && itemDate <= end;
//       }

//       return isMatch;
//     });
//   };

//   const renderFilteredData = () => {
//     const filteredData = filterData(outputData);
//     return (
//       <div className='dekrypted-container'>
//         {filteredData.map((outputItem, index) => (
//           <div className='dekrypted' key={index}>
//             <div className='filters'>
//               <input
//                 type="checkbox"
//                 style={{ cursor: 'pointer' }}
//                 className='selected'
//                 checked={selectedData.includes(index)}
//                 onChange={() => toggleSelect(index)}
//               />
//               <h3>Decrypted Data # {index + 1}</h3>
//             </div>
//             <ul className='no-markers'>
//               {Object.entries(outputItem).map(([field, value]) => (
//                 <li key={field} style={getFieldStyle(field, value)}>
//                   {field}: {formatFieldValue(field, value)}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const getFieldStyle = (field, value) => {
//     if (field === 'orderNumber') {
//       return { fontWeight: 'bold' };
//     }
//     if (field === 'currentDateTime') {
//       return { color: 'blue' };
//     }
//     return {};
//   };

//   const formatFieldValue = (field, value) => {
//     if (field === 'currentDateTime') {
//       return <strong translate="no">{value} <br /> UTC ISO {convertToUTC(value)}</strong>;
//     }
//     return value;
//   };

//   const toggleSelect = (index) => {
//     if (selectedData.includes(index)) {
//       setSelectedData(selectedData.filter((item) => item !== index));
//     } else {
//       setSelectedData([...selectedData, index]);
//     }
//     setSelectAllText('Deselect All');
//   };

//   const handleSelectAll = () => {
//     if (selectAllText === 'Select All') {
//       const allFilteredIndexes = filterData(outputData).map((item, index) => index);
//       setSelectedData(allFilteredIndexes);
//       setSelectAllText('Deselect All');
//     } else {
//       setSelectedData([]);
//       setSelectAllText('Select All');
//     }
//   };

//   const copySelectedDataToClipboard = () => {
//     const selectedItems = selectedData.map((index) => {
//       const item = outputData[index];
//       const filteredItem = {};
//       for (const [key, value] of Object.entries(item)) {       
//         if (value !== '') {
//           filteredItem[key] = value;
//         }
//       }
//       return filteredItem;
//     });
//     const clipboardText = selectedItems.map((item) => {     
//      return Object.entries(item).map(([key, value]) => `${key}:${value}`).join(',')
//     }).join(';\n');
//     navigator.clipboard.writeText(clipboardText)
//       .then(() => alert('Selected data copied to clipboard'))
//       .catch((error) => alert('⚠️Failed to copy selected data to clipboard: ', error));
//   };

//   const Reset = () => {
//     setEndDate("");
//     setStartDate("");
//     setSearchValue("");

//     setSelectedData([]);
//       setSelectAllText('Select All');
//   };
// console.log(selectedData)
//   return (
//     <div className='filters'>
//       <input
//         type="search"
//         className='form-input'
//         value={searchValue}
//         onChange={(e) => setSearchValue(e.target.value)}
//         placeholder="Filter..."
//       />
//       <select className='form-input' value={filterField} onChange={(e) => setFilterField(e.target.value)}>
//         <option value="">Select Filter Field</option>
//         {outputData.length > 0 &&
//           Object.keys(outputData[0]).map((field) => (
//             <option key={field} value={field}>
//               {field}
//             </option>
//           ))
//         }
//       </select>

//       <label>
//         <b>Start Date:</b>
//         <input
//           type="date"
//           className='form-input'
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//         />
//       </label>
//       <label>
//         <b>End Date:</b>
//         <input
//           type="date"
//           className='form-input'
//           value={endDate}
//           onChange={(e) => setEndDate(e.target.value)}
//         />
//       </label>
//       {(searchValue !== "" || startDate !== "" || endDate !== "") && 
//         <button className='back-button selected' onClick={Reset}>Reset Filter</button>
//       }
//       <div className='filters'>
//         {outputData && filterData(outputData).length > 0 && (
//           <button className='back-button selected' onClick={handleSelectAll}>{selectAllText}</button>
//         )}
//         {selectedData && selectedData.length > 0 && (
//           <button className='back-button selected' onClick={copySelectedDataToClipboard}>Copy Selected to Clipboard</button>
//         )}
//         <div className='dekrypted-container'>
//           {renderFilteredData()}            
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FilteredDataDisplay;
