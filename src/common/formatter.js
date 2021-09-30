const formatter = {
    dateFormatter(date) {
        let year = date.getFullYear(),
            month = date.getMonth()+1,
            day = date.getDate();
        month = month > 9? month: '0'+month
        console.log(`${year}-${month}-${day}`)
        return `${year}-${month}-${day}`
    }
}

export default formatter