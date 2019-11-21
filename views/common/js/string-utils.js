function _getMatching(query, delegates) {
    let matching = [];
    query = query.toLowerCase();
    for (let del of delegates) {
        let testName = del.name.toLowerCase();
        if (testName.startsWith(query)) {
            matching.push(del);
        }
    }
    return matching;
}

module.exports._getMatching = _getMatching; 