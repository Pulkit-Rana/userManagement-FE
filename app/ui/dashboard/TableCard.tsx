'use client';
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/app/ui/components/table';

interface Transaction {
  id: number;
  name: string;
  amount: string;
  status: string;
}

interface TableCardProps {
  data: Transaction[];
}

export function TableCard({ data }: TableCardProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row: Transaction) => (
          <TableRow key={row.id}>
            <TableCell>{row.id}</TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.amount}</TableCell>
            <TableCell>{row.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
