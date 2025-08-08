import { useState, useEffect } from "react";
import { 
  collection, 
  doc, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CheckIn, SavedSpot, Comment, InsertCheckIn, InsertSavedSpot, InsertComment } from "@shared/schema";

export function useCheckIns(userId?: string) {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchCheckIns = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "checkIns"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const checkInsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        })) as CheckIn[];
        setCheckIns(checkInsData);
      } catch (error) {
        console.error("Error fetching check-ins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckIns();
  }, [userId]);

  const addCheckIn = async (checkInData: InsertCheckIn) => {
    try {
      const docRef = await addDoc(collection(db, "checkIns"), {
        ...checkInData,
        createdAt: Timestamp.now(),
      });
      
      const newCheckIn: CheckIn = {
        id: docRef.id,
        ...checkInData,
        createdAt: new Date(),
      };
      
      setCheckIns(prev => [newCheckIn, ...prev]);
      return newCheckIn;
    } catch (error) {
      console.error("Error adding check-in:", error);
      throw error;
    }
  };

  return { checkIns, loading, addCheckIn };
}

export function useSavedSpots(userId?: string) {
  const [savedSpots, setSavedSpots] = useState<SavedSpot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchSavedSpots = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "savedSpots"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const savedSpotsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        })) as SavedSpot[];
        setSavedSpots(savedSpotsData);
      } catch (error) {
        console.error("Error fetching saved spots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedSpots();
  }, [userId]);

  const addSavedSpot = async (savedSpotData: InsertSavedSpot) => {
    try {
      // Check if spot is already saved
      const existingSpot = savedSpots.find(s => s.spotId === savedSpotData.spotId);
      if (existingSpot) {
        throw new Error("Spot already exists in saved list");
      }

      const docRef = await addDoc(collection(db, "savedSpots"), {
        ...savedSpotData,
        createdAt: Timestamp.now(),
      });
      
      const newSavedSpot: SavedSpot = {
        id: docRef.id,
        ...savedSpotData,
        createdAt: new Date(),
      };
      
      setSavedSpots(prev => [newSavedSpot, ...prev]);
      return newSavedSpot;
    } catch (error) {
      console.error("Error saving spot:", error);
      throw error;
    }
  };

  const removeSavedSpot = async (spotId: string) => {
    try {
      const spotToRemove = savedSpots.find(s => s.spotId === spotId);
      if (!spotToRemove) return;

      await deleteDoc(doc(db, "savedSpots", spotToRemove.id));
      setSavedSpots(prev => prev.filter(s => s.spotId !== spotId));
    } catch (error) {
      console.error("Error removing saved spot:", error);
      throw error;
    }
  };

  return { savedSpots, loading, addSavedSpot, removeSavedSpot };
}

export function useComments(spotId?: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!spotId) return;

    const fetchComments = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "comments"),
          where("spotId", "==", spotId),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const commentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        })) as Comment[];
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [spotId]);

  const addComment = async (commentData: InsertComment) => {
    try {
      const docRef = await addDoc(collection(db, "comments"), {
        ...commentData,
        createdAt: Timestamp.now(),
      });
      
      const newComment: Comment = {
        id: docRef.id,
        ...commentData,
        createdAt: new Date(),
      };
      
      setComments(prev => [newComment, ...prev]);
      return newComment;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };

  return { comments, loading, addComment };
}
