import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

const LogContext = createContext(null);

export const LogProvider = ({ children }) => {
  const [todayLogs, setTodayLogs] = useState([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchTodayLogs = useCallback(async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await api.get(`/logs?date=${today}`);
      const logs = response.data;
      setTodayLogs(logs);
      const total = logs.reduce((sum, log) => sum + log.total_kg, 0);
      setTodayTotal(Math.round(total * 100) / 100);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addLog = async (logData) => {
    try {
      const response = await api.post('/logs', logData);
      const newLog = response.data;
      setTodayLogs(prev => [newLog, ...prev]);
      const newTotal = Math.round((todayTotal + newLog.total_kg) * 100) / 100;
      setTodayTotal(newTotal);
      return newLog;
    } catch (error) {
      console.error('Error adding log:', error);
      throw error;
    }
  };

  const deleteLog = async (logId) => {
    try {
      await api.delete(`/logs/${logId}`);
      const logToDelete = todayLogs.find(log => log.id === logId);
      setTodayLogs(prev => prev.filter(log => log.id !== logId));
      if (logToDelete) {
        const newTotal = Math.round((todayTotal - logToDelete.total_kg) * 100) / 100;
        setTodayTotal(newTotal);
      }
    } catch (error) {
      console.error('Error deleting log:', error);
      throw error;
    }
  };

  return (
    <LogContext.Provider value={{
      todayLogs,
      todayTotal,
      loading,
      fetchTodayLogs,
      addLog,
      deleteLog
    }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLogs = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLogs must be used within a LogProvider');
  }
  return context;
};
