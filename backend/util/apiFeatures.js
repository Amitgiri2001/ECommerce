class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    // write search function
    search() {
        const keyword = this.queryStr.keyword ?
            {
                name: {
                    $regex: this.queryStr.keyword,
                    $options: "i"
                },
            }
            : {}

        // console.log({ ...keyword });
        this.query = this.query.find({ ...keyword });
        return this;
    }

    // for filter
    filter() {
        // we want to change the queryString .
        const queryCopy = { ...this.queryStr };
        console.log(queryCopy);

        // Remove some keyword from the queryStr
        const removeWord = ["keyword", "page", "limit"];

        removeWord.forEach((key) => delete queryCopy[key]);
        // console.log(queryCopy);

        // Price filter
        // console.log(queryCopy);
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        // call mongodb find method for find the category
        // console.log(queryStr);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    // pagination ->Products per page
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
    
        const skip = resultPerPage * (currentPage - 1);
    
        this.query = this.query.limit(resultPerPage).skip(skip);
    
        return this;
      }

}

module.exports = ApiFeatures;