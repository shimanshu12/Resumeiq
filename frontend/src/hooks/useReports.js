import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

// Fetches and manages the current user's saved reports (list + summary).
export function useReports({ search = '', page = 1, pageSize = 10 } = {}) {
  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/reports', { params: { search, page, pageSize } });
      setReports(data.reports || []);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not load reports.');
    } finally {
      setLoading(false);
    }
  }, [search, page, pageSize]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const deleteReport = async (id) => {
    try {
      await api.delete(`/reports/${id}`);
      toast.success('Report deleted.');
      fetchReports();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not delete report.');
    }
  };

  return { reports, total, loading, refetch: fetchReports, deleteReport };
}
