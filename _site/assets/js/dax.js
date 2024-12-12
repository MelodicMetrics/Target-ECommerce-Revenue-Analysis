hljs.registerLanguage('dax', function (hljs) {
    // Base SQL grammar
    const sql = hljs.getLanguage('sql');

    // DAX-specific keywords and functions
    const DAX_KEYWORDS = [
        'CALCULATE', 'SUM', 'AVERAGEX', 'SUMX', 'FILTER', 'RELATED', 'DISTINCT', 'VALUES',
        'SELECTEDVALUE', 'IF', 'SWITCH', 'AND', 'OR', 'RETURN', 'VAR', 'ALL', 'ALLSELECTED'
    ];

    const DAX_OPERATORS = [
        '=', '\\+', '-', '\\*', '/', '&', '<', '>', '<=', '>=' // Escape regex metacharacters
    ];

    // Custom DAX grammar
    const DAX_GRAMMAR = {
        keywords: {
            keyword: (typeof sql.keywords.keyword === 'string' ? sql.keywords.keyword.split(" ") : sql.keywords.keyword).concat(DAX_KEYWORDS).join(" "),
            literal: sql.keywords.literal,
            built_in: sql.keywords.built_in || ""
        },
        contains: [
            {
                className: 'table-reference', // Custom style for table references
                begin: "'",
                end: "'",
                relevance: 10
            },
            {
                className: 'column', // Custom style for columns
                begin: '\\[',
                end: '\\]',
                relevance: 10
            },
            {
                className: 'string', // Custom style for strings
                begin: '"', // Double quotes for strings
                end: '"',
                relevance: 0 // Adjust relevance if necessary
            },
            {
                className: 'built_in', // Highlight DAX functions
                begin: '\\b(' + DAX_KEYWORDS.join('|') + ')\\b'
            },
            {
                className: 'operator', // Highlight operators
                begin: '(' + DAX_OPERATORS.join('|') + ')'
            },
            ...sql.contains // Include existing SQL rules
        ]
    };

    return {
        name: 'DAX',
        keywords: DAX_GRAMMAR.keywords,
        contains: DAX_GRAMMAR.contains
    };
});

// Assign `dax` to make it globally available
const dax = function (hljs) {
    return hljs.getLanguage('dax');
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = dax; // For CommonJS environments
} else {
    window.dax = dax; // For browser environments
}
