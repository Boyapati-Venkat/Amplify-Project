import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, Search, Download, Filter, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { generateClient } from 'aws-amplify/api';
import awsconfig from '../aws-exports';

// GraphQL query for fetching transformed records
const listTransformedRecords = /* GraphQL */ `
  query ListTransformedRecords(
    $filter: ModelTransformedRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTransformedRecords(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        email
        score
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

interface TransformedRecord {
  id: string;
  name: string;
  email: string;
  score: number;
  createdAt: string;
}

// Create a custom event for file upload completion
export const FILE_UPLOAD_COMPLETE_EVENT = 'fileUploadComplete';

const DataViewer = () => {
  const [records, setRecords] = useState<TransformedRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<TransformedRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [previousTokens, setPreviousTokens] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const { toast } = useToast();
  
  // Initialize client conditionally
const client = React.useMemo(() => {
  return typeof window !== 'undefined' ? generateClient() : null;
}, []);

  // Fetch data from AppSync/DynamoDB
  const fetchRecords = useCallback(async (newPage?: boolean, token?: string | null) => {
    if (typeof window === 'undefined' || !client) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Attempting to fetch records from AppSync...");
      const response = await client.graphql({
        query: listTransformedRecords,
        variables: {
          limit: 10,
          nextToken: token !== undefined ? token : nextToken
        },
        authMode: 'userPool'
      });
      
      const fetchedRecords = response.data.listTransformedRecords.items;
      const nextPageToken = response.data.listTransformedRecords.nextToken;
      
      // If this is a "next page" request, add current token to history
      if (newPage && nextToken) {
        setPreviousTokens(prev => [...prev, nextToken]);
        setCurrentPage(prev => prev + 1);
      }
      
      setRecords(fetchedRecords);
      setFilteredRecords(fetchedRecords);
      setNextToken(nextPageToken);
      
      toast({
        title: "Data loaded",
        description: `Successfully loaded ${fetchedRecords.length} records.`,
      });
    } catch (error) {
      console.error('Error fetching records:', error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [client, nextToken, recordsPerPage, toast]);

  // Handle going to previous page
  const handlePreviousPage = () => {
    if (previousTokens.length === 0) return;
    
    // Get the token for the previous page
    const newPreviousTokens = [...previousTokens];
    const previousToken = newPreviousTokens.pop();
    
    // Update state
    setPreviousTokens(newPreviousTokens);
    setCurrentPage(prev => prev - 1);
    
    // Fetch with the previous token
    fetchRecords(false, previousToken || null);
  };

  // Handle going to next page
  const handleNextPage = () => {
    if (!nextToken) return;
    fetchRecords(true);
  };

// Initial data fetch
useEffect(() => {
  // Check if AppSync endpoint is configured
  if (awsconfig.aws_appsync_graphqlEndpoint.includes("YOUR_NEW_APPSYNC_ENDPOINT")) {
    console.error("AppSync endpoint not properly configured in aws-exports.js");
    toast({
      title: "Configuration Error",
      description: "The AppSync API endpoint is not properly configured. Please update aws-exports.js with the correct endpoint.",
      variant: "destructive"
    });
    // Use mock data as fallback
    const mockData: TransformedRecord[] = [
      // Mock data here...
    ];
    setRecords(mockData);
    setFilteredRecords(mockData);
  } else {
    fetchRecords();
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // Empty dependency array to run only once

  // Listen for file upload complete event
useEffect(() => {
    const handleFileUploadComplete = () => {
      console.log("File upload complete event received, refreshing data...");
      // Reset pagination and fetch fresh data
      setPreviousTokens([]);
      setCurrentPage(1);
      fetchRecords(false, null);
    };

    // Add event listener
    window.addEventListener(FILE_UPLOAD_COMPLETE_EVENT, handleFileUploadComplete);

    // Clean up
    return () => {
      window.removeEventListener(FILE_UPLOAD_COMPLETE_EVENT, handleFileUploadComplete);
    };
  }, [fetchRecords]);

  useEffect(() => {
    const filtered = records.filter(record =>
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecords(filtered);
  }, [searchTerm, records]);

  const handleRefresh = async () => {
    // Reset pagination and fetch fresh data
    setPreviousTokens([]);
    setCurrentPage(1);
    await fetchRecords(false, null);
  };

  const handleExport = () => {
    // Check for browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    const csvContent = [
      ['Name', 'Email', 'Score', 'Created At'],
      ...filteredRecords.map(record => [
        record.name,
        record.email,
        record.score.toString(),
        new Date(record.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export complete",
      description: "Your data has been exported to CSV.",
    });
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 80) return 'secondary';
    return 'outline';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                Data Records
              </CardTitle>
              <CardDescription>
                View and manage your transformed data records
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={filteredRecords.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading data...</h3>
              <p className="text-gray-600">
                Fetching records from the database.
              </p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No data found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms.' : 'No records available in the database.'}
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Score</TableHead>
                    <TableHead className="font-semibold">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{record.name}</TableCell>
                      <TableCell className="text-gray-600">{record.email}</TableCell>
                      <TableCell>
                        <Badge variant={getScoreBadgeVariant(record.score)}>
                          {record.score}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDate(record.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {filteredRecords.length > 0 && (
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <p>
                Page {currentPage} • Showing {filteredRecords.length} records per page
              </p>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={previousTokens.length === 0 || isLoading}
                  onClick={handlePreviousPage}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={!nextToken || isLoading}
                  onClick={handleNextPage}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataViewer;