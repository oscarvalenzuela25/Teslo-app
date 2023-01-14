import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import AdminLayout from '../../components/layouts/AdminLayout';
import { PeopleOutline } from '@mui/icons-material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Grid, MenuItem, Select } from '@mui/material';
import { IUser, Role } from '../../interfaces/user';
import useSWR from 'swr';
import tesloApi from '../../api/tesloApi';

const validRoles = [
  {
    value: 'client',
    label: 'Cliente',
  },
  {
    value: 'admin',
    label: 'Administrador',
  },
];

const UsersPage: NextPage = () => {
  const { data = [], error } = useSWR<IUser[]>('/api/admin/users');
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    setUsers(data);
  }, [data]);

  if (!data && !error) return <></>;

  const onRoleUpdated = async (userId: number | string, newRole: Role) => {
    try {
      await tesloApi.put('/admin/users', {
        userId,
        role: newRole,
      });
      const updatedUsers = users.map(user => ({
        ...user,
        role: user._id === userId ? newRole : user.role,
      }));
      setUsers(updatedUsers);
    } catch (error) {
      alert('No se pudo actualizar el rol del usuario');
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'email',
      headerName: 'Correo',
      width: 250,
    },
    {
      field: 'name',
      headerName: 'Nombre completo',
      width: 300,
    },
    {
      field: 'role',
      headerName: 'Rol',
      width: 300,
      // @ts-ignore
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <Select
            value={row.role}
            label="Rol"
            onChange={e => onRoleUpdated(row.id, e.target.value)}
            sx={{ width: 300 }}
          >
            {validRoles.map(role => (
              <MenuItem value={role.value} key={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
  ];

  const rows = users.map(({ _id, email, name, role }) => ({
    id: _id,
    email,
    name,
    role,
  }));

  return (
    <AdminLayout
      title={'Usuarios'}
      subTitle={'Manteniemiento de usuarios'}
      icon={<PeopleOutline />}
    >
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default UsersPage;
