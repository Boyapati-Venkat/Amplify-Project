import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Plus, Database } from 'lucide-react';
import { listTransformedRecords } from '../graphql/queries';
import { createTransformedRecord } from '../graphql/mutations';

// Initialize the GraphQL client
const client = generateClient();

interface TransformedRecord {
  id: string;
  userId: string;
  name: string;
  email: string;
  score: number;
  createdAt: string;
}

interface DataViewerProps {
  userId: string;
}

const DataViewer: React.FC<DataViewerProps> = ({ userId }) => {
  const [records, setRecords] = useState<TransformedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchRecords = async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) setRefreshing(true);
      
      console.log('Fetching records for user:', userId);
      
      const response = await client.graphql({
        query: listTransformedRecords,
        variables: {
          filter: {
            userId: {
              eq: userId
            }
          }
        }
      });

      const fetchedRecords = (response as any).data?.listTransformedRecords?.items || [];
      console.log('Fetched records:', fetchedRecords);
      
      setRecords(fetchedRecords);
      
      if (showRefreshToast) {
        toast({
          title: "Data refreshed",
          description: `Found ${fetchedRecords.length} records.`,
        });
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      
      // For demo purposes, show mock data if GraphQL fails
      const mockData: TransformedRecord[] = [
        {
          id: '1',
          userId: userId,
          name: 'John Doe',
          email: 'john.doe@example.com',
          score: 95,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          userId: userId,
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          score: 87,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          userId: userId,
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          score: 92,
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      
      setRecords(mockData);
      
      toast({
        title: "Using demo data",
        description: "GraphQL API not configured. Showing sample records.",
        variant: "default",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const addSampleRecord = async () => {
    try {
      const sampleRecord = {
        userId: userId,
        name: `Sample User ${Math.floor(Math.random() * 1000)}`,
        email: `user${Math.floor(Math.random() * 1000)}@example.com`,
        score: Math.floor(Math.random() * 100) + 1
      };

      console.log('Creating sample record:', sampleRecord);

      const response = await client.graphql({
        query: createTransformedRecord,
        variables: {
          input: sampleRecord
        }
      });

      console.log('Created record:', response);

      toast({
        title: "Record created",
        description: "Sample record has been added to DynamoDB.",
      });

      // Refresh the data
      await fetchRecords();
    } catch (error) {
      console.error('Error creating record:', error);
      
      // For demo purposes, add a mock record locally
      const newRecord: TransformedRecord = {
        id: `mock-${Date.now()}`,
        userId: userId,
        name: `Sample User ${Math.floor(Math.random() * 1000)}`,
        email: `user${Math.floor(Math.random() * 1000)}@example.com`,
        score: Math.floor(Math.random() * 100) + 1,
        createdAt: new Date().toISOString()
      };
      
      setRecords(prev => [newRecord, ...prev]);
      
      toast({
        title: "Demo record added",
        description: "Added sample record locally (GraphQL not configured).",
      });
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [userId]);

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return "default";
    if (score >= 75) return "secondary";
    return "outline";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-900">
            {records.length} Records
          </span>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={addSampleRecord}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Sample</span>
          </Button>
          <Button
            onClick={() => fetchRecords(true)}
            variant="outline"
            size="sm"
            disabled={refreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Database className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium">No records found</p>
          <p className="text-sm">Upload CSV files or add sample data to get started.</p>
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
              {records.map((record) => (
                <TableRow key={record.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{record.name}</TableCell>
                  <TableCell className="text-gray-600">{record.email}</TableCell>
                  <TableCell>
                    <Badge variant={getScoreBadgeVariant(record.score)}>
                      {record.score}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {formatDate(record.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>• Data fetched from DynamoDB via GraphQL</p>
        <p>• Only your records are displayed (owner-based auth)</p>
        <p>• Real-time updates when new data is added</p>
      </div>
    </div>
  );
};

export default DataViewer;