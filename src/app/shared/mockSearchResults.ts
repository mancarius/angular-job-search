import { mockJob } from "./mockJob";

export const mockSearchResults = {
        "page": 1, 
        "page_count": 2, 
        "items_per_page": 20, 
        "took": 41, 
        "timed_out": false, 
        "total": 32, 
        "results": [
            mockJob
        ],
        "aggregations": {}
    };