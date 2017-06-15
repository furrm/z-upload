$siteUrl = "http://ddvm0277-unity1:82"
$domain = "OMNIAD"

# This assumes that the (Country) template has been entered with metric number starting from 5000, 
# therefore 'All' will have number ranging from 5000 - 9999, 
# 'AMS' ranging from 10000 = 14999 etc.
$countries = @{
	"ALL" = @{"Title" = "All"; "Modifier" = 0; "Currency" = "£"; };
	"AMS" = @{"Title" = "Amsterdam"; "Modifier" = 5000; "Currency" = "€"; };
	"BEL" = @{"Title" = "Belgium"; "Modifier" = 10000; "Currency" = "€"; };
	"LUX" = @{"Title" = "Luxembourg"; "Modifier" = 15000; "Currency" = "€"; };
	"UK" = @{"Title" = "UK"; "Modifier" = 20000; "Currency" = "£"; };
	"USA" = @{"Title" = "USA"; "Modifier" = 25000; "Currency" = "$"; };
	"FRA" = @{"Title" = "France"; "Modifier" = 40000; "Currency" = "€"; };
	"GER" =@{"Title" =  "Germany"; "Modifier" = 30000; "Currency" = "€"; };
	"IT" = @{"Title" = "Italy"; "Modifier" = 35000;  "Currency" = "€";};
}

$hierarchy = @{
	"IT Service Management" = @{ "DashboardType" = "SSC"; "ReportID" = 1; };
	"IT Service Desk" = @{ "DashboardType" = "SSC"; "ReportID" = 1; };
	"BSM" = @{ "DashboardType" = "SSC"; "ReportID" = 1; };
	"Comms Team" = @{ "DashboardType" = "SSC"; "ReportID" = 1; };
	"Library Services" = @{ "DashboardType" = "SSC"; "ReportID" = 1; };
	"Document Production" = @{ "DashboardType" = "SSC"; "ReportID" = 1; };
	"Creative Services" = @{ "DashboardType" = "SSC"; "ReportID" = 1; };
	"Marketing" = @{ "DashboardType" = "SSC"; "ReportID" = 1; };
	"HR" = @{ "DashboardType" = "SSC"; "ReportID" = 1; };
	"Accounts Payable" = @{ "DashboardType" = "SSC"; "ReportID" = 1; };
	"Revenue" = @{ "DashboardType" = "SSC"; "ReportID" = 1; };
	"Management Accounting" = @{ "DashboardType" = "SSC"; "ReportID" = 1; };
	"Credit Control" = @{ "DashboardType" = "SSC"; "ReportID" = 1; };
	"E-billing" = @{ "DashboardType" = "SSC"; "ReportID" = 1; };
	"E-billing Progress (1-10)" = @{ "DashboardType" = "SSC"; "ReportID" = 1; };
	"E-billing Progress (11-20)" = @{ "DashboardType" = "SSC"; "ReportID" = 1; };
	"E-billing Progress (21-31)" = @{ "DashboardType" = "SSC"; "ReportID" = 1; };
	"Cash Allocation" = @{ "DashboardType" = "SSC"; "ReportID" = 1; };
	"Service Summary" = @{ "DashboardType" = "OPS"; "ReportID" = 2; };
	"Finance & Operations" = @{ "DashboardType" = "OPS"; "ReportID" = 2; };
	"On-going Activities" = @{ "DashboardType" = "OPS"; "ReportID" = 2; };
	"People" = @{ "DashboardType" = "OPS"; "ReportID" = 2; };
	"Credit Control (Amsterdam)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "AMS"; };
	"Accounts Payable (Amsterdam)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "AMS"; };
	"Revenue (Amsterdam)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "AMS"; };
	"E-billing (Amsterdam)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "AMS"; };
	"Credit Control (Belgium)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "BEL"; };
	"Accounts Payable (Belgium)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "BEL"; };
	"Revenue (Belgium)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "BEL"; };
	"E-billing (Belgium)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "BEL"; };
	"Credit Control (Luxembourg)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "LUX"; };
	"Accounts Payable (Luxembourg)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "LUX"; };
	"Revenue (Luxembourg)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "LUX"; };
	"E-billing (Luxembourg)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "LUX"; };
	"Credit Control (UK)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "UK"; };
	"Accounts Payable (UK)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "UK"; };
	"Revenue (UK)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "UK"; };
	"E-billing (UK)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "UK"; };
	"Credit Control (USA)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "USA"; };
	"Accounts Payable (USA)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "USA"; };
	"Revenue (USA)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "USA"; };
	"E-billing (USA)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "USA"; };
	"Credit Control (ALL)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "ALL"; };
	"Accounts Payable (ALL)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "ALL"; };
	"Revenue (ALL)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "ALL"; };
	"E-billing (ALL)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "ALL"; };
	"Accounts Payable (Germany)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "GER"; };
	"Revenue (Germany)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "GER"; };
	"E-billing (Germany)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "GER"; };
	"Credit Control (France)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "FRA"; };
	"Revenue (France)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "FRA"; };
	"E-billing (France)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "FRA"; };
	"Credit Control (Italy)" = @{ "DashboardType" = "FIN"; "ReportID" = 3; "Country" = "IT"; };
}

$dashboardTypes = @{
	"SSC" = @{ "Title" = "SSC Dashboard" };
	"OPS" = @{ "Title" = "OPS Dashboard" };
	"FIN" = @{ "Title" = "FIN ({country})" };
}

$defaultClientOffices = @("Abu Dhabi","Amsterdam","Antwerp","Athens (representative office)","Bangkok","Barcelona","Beijing","Belfast","Bratislava","Brussels","Bucharest (associated office)","Budapest","Casablanca","Doha","Dubai","Düsseldorf","Frankfurt","Hamburg","Hanoi","Ho Chi Minh City","Hong Kong","Istanbul","Jakarta (associated office)","London","Luxembourg","Madrid","Mannheim","Milan","Moscow","Munich","New York","Paris","Perth","Prague","Riyadh (associated office)","Rome","São Paulo","Shanghai","Singapore","Sydney","Tokyo","Warsaw", "Washington, D.C.", "Yangon")
$defaultDepartments = @("Banking","Corporate","Employment & Benefits","ICM","Intellectual Property","Litigation","Real Estate","Tax","Energy & Resources","Financial Institutions","Infrastructure","Life Sciences","Mining","Private Equity","Real Estate","TMT")
$defaultClients = @("DEUTSCHE BANK AG","J.P. MORGAN CHASE & CO","CITIGROUP INC","BANK OF AMERICA MERRILL LYNCH","HSBC HOLDINGS PLC","THE GOLDMAN SACHS GROUP INC","CREDIT SUISSE GROUP","BNP PARIBAS","UBS AG","BARCLAYS PLC","GENERAL ELECTRIC COMPANY INC.","STANDARD CHARTERED PLC","THE BANK OF NEW YORK MELLON CORPORATION","VIRGIN MANAGEMENT LIMITED","Islamic Republic of Pakistan","Meldrew Participations B.V.","SOCIETE GENERALE","Lloyds Banking Group PLC","THE ROYAL BANK OF SCOTLAND GROUP PLC","UNICREDIT S.P.A.")