# CRD Bike Count

The CRD with the assistance of community volunteers has been counting bicycle volumes throughout the region since 2011. These counts are performed at screenlines. All cyclist are counted, therefore a bicycle with a parent and child would count at two cyclists.

Counts are performed in the AM peak (7-9am) and PM peak (3-6pm). Caution should be exercised in doing year over year comparisons as the values presented are point in time volumes and are not annualized.

This data may only be used under the terms of the Open Government License - Capital Regional District. You are encouraged to contact the data custodian(regionalplanning@crd.bc.ca) if you have any questions regarding fitness for use.

# Data

BikeCountsHourly.csv
All row durations are 1 hour.

countID - Unique count Station identifier
onStreet - Name of street/trail segment that was counted
xStreet - Nearest cross street/trail to the screenline
location - Location (E,W,N,S) of the screenline relative to the xStreet
countDirection - (EW,NS) Headings of the volume through the screenline
countStart - (YYYY-MM-DD HH:MM:SS.MS) The start hour of the row
totalCount - Total volume of cyclist for the row

peakHour.json
Contains point features with a peak hour count calculated from BikeCountsHourly.csv
peak hour is the max hourly count including both headings. 



