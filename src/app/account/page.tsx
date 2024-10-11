"use client";

import { useEffect, useState } from 'react';

const AccountSettings = () => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [fullname, setFullname] = useState('');

  useEffect(() => {
    const storedPhone = localStorage.getItem('phone');
    const storedEmail = localStorage.getItem('email');
    const storedAddress = localStorage.getItem('address');
    const storedFullname = localStorage.getItem('fullname');

    if (storedPhone) {
      setPhone(storedPhone);
    }
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedAddress) {
      setAddress(storedAddress);
    }
    if (storedFullname) {
      setFullname(storedFullname);
    }
  }, []);

  return (
    <div>
      <h1>Account Settings</h1>
      <p>Phone Number: {phone}</p>
      <p>Email: {email}</p>
      <p>Address: {address}</p>
      <p>Full Name: {fullname}</p>
    </div>
  );
};

export default AccountSettings;
