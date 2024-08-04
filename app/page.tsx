"use client"
import { Box, Typography, Button, Modal, TextField } from '@mui/material';
import { doc, setDoc, getDocs, query, deleteDoc, getDoc } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firestore } from './firebase';
import React from 'react';
import dotenv from 'dotenv';
dotenv.config();

const mainBoxStyle = {
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 2,
  background: '#101357',
};

const titleBoxStyle = {
  width: '100%',
  maxWidth: '1200px',
  height: '80px',
  backgroundColor: '#a4330d',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  marginBottom: 5,
};

const titleTextStyle = {
  color: 'white',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  textAlign: 'center',
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

const addButtonStyle = {
  bgcolor: 'primary.main',
  color: 'white',
  '&:hover': {
    bgcolor: 'primary.dark',
  },
};

const quantityButtonStyle = {
  minWidth: '40px',
  height: '40px',
  fontSize: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  borderRadius: '50%',
  border: '1px solid #ccc',
  backgroundColor: '#fff',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
};

const itemBoxStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: '30px',
  bgcolor: 'background.default',
  boxShadow: 1,
  borderRadius: 1,
  paddingX: 2,
  paddingY: 1,
  marginBottom: 1,
  overflow: 'hidden',
};

const itemInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  flexGrow: 1,
};

const itemNameStyle = {
  fontWeight: 'bold',
  overflowWrap: 'break-word',
  flexGrow: 1,
  color: '#000',
};

const quantityContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginRight: '16px',
};

const quantityTextStyle = {
  fontWeight: 'bold',
  color: '#000',
};

const searchBoxStyle = {
  width: '100%',
  marginBottom: 2,
  backgroundColor: '#fff',
};

const editButtonStyle = {
  bgcolor: '#ed6e3a', 
  color: 'white',
  '&:hover': {
    bgcolor: '#d45a29', 
  },
};

const addItemButtonStyle = {
  bgcolor: 'primary.main',
  color: 'white',
  width: '100%',
  marginTop: 2,
  '&:hover': {
    bgcolor: 'primary.dark',
  },
};

const pantryItemsContainerStyle = {
  height: '350px', 
  overflow: 'auto', 
  padding: 2,
};

interface PantryItem {
  name: string;
  count: number;
}

const LoadingSpinner = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100px',
    }}
  >
    <Box
      sx={{
        border: '4px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '50%',
        borderTop: '4px solid #3498db',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
      }}
    />
    <style jsx>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </Box>
);

const RecipeCard = ({ recipe }: { recipe: string }) => (
  <Box
    sx={{
      width: '100%',
      maxWidth: '600px',
      marginTop: 2,
      padding: 2,
      borderRadius: '8px',
      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
    }}
  >
    <Typography variant="h6" color="#333">
      Recipe
    </Typography>
    <Typography>{recipe}</Typography>
  </Box>
);

export default function Home() {
  const [pantry, setPantry] = useState<PantryItem[]>([]);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editItemName, setEditItemName] = useState('');
  const [itemToEdit, setItemToEdit] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenEdit = (name: string) => {
    setItemToEdit(name);
    setEditItemName(name);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => setOpenEdit(false);

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const pantryList: PantryItem[] = [];
    docs.forEach((doc) => {
      const data = doc.data();
      pantryList.push({ name: doc.id, count: data.count || 0 });
    });
    console.log(pantryList);
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item: string) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry();
  };

  const increaseQuantity = async (item: string) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    }
    await updatePantry();
  };

  const decreaseQuantity = async (item: string) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
    }
    await updatePantry();
  };

  const handleEditItem = async () => {
    if (itemToEdit && editItemName) {
      const oldDocRef = doc(collection(firestore, 'pantry'), itemToEdit);
      const newDocRef = doc(collection(firestore, 'pantry'), editItemName);

      const docSnap = await getDoc(oldDocRef);
      if (docSnap.exists()) {
        const { count } = docSnap.data();
        await setDoc(newDocRef, { count });
        await deleteDoc(oldDocRef);
      }

      await updatePantry();
      handleCloseEdit();
    }
  };

  const generateRecipe = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Generate a recipe based on the following ingredients: ${pantry.map(item => item.name).join(', ')}`,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('OpenAI response:', data);
  
      if (data.choices && data.choices.length > 0) {
        setRecipe(data.choices[0].text.trim());
      } else {
        setRecipe('No recipe generated.');
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      setRecipe('Failed to generate recipe.');
    }
    setIsGenerating(false);
  };
  
  const filteredPantry = pantry.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Box sx={mainBoxStyle}>
      {/* Title Box */}
      <Box sx={titleBoxStyle}>
        <Typography sx={titleTextStyle}>
          Pantry Management App👨🏻‍🍳
        </Typography>
      </Box>

      <Box
        border="1px solid #ddd"
        borderRadius={2}
        overflow="hidden"
        boxShadow={3}
        width="100%"
        maxWidth="1200px"
        padding={2}
      >
        <Box
          height="100px"
          bgcolor="#beef00"
          display="flex"
          justifyContent="center"
          alignItems="center"
          boxShadow={1}
        >
          <Typography variant="h4" color="#333" textAlign="center">
            Pantry Items
          </Typography>
        </Box>

        {/* Search Box inside Pantry Items */}
        <TextField
          sx={searchBoxStyle}
          label="Search Items"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Pantry Items Container with Scroll */}
        <Box sx={pantryItemsContainerStyle}>
          {filteredPantry.map((item) => (
            <Box key={item.name} sx={itemBoxStyle}>
              <Box sx={itemInfoStyle}>
                <Typography sx={itemNameStyle}>
                  {item.name}
                </Typography>
                <Box sx={quantityContainerStyle}>
                  <Button
                    sx={quantityButtonStyle}
                    onClick={() => decreaseQuantity(item.name)}
                  >
                    -
                  </Button>
                  <Typography sx={quantityTextStyle}>
                    {item.count}
                  </Typography>
                  <Button
                    sx={quantityButtonStyle}
                    onClick={() => increaseQuantity(item.name)}
                  >
                    +
                  </Button>
                </Box>
              </Box>
              <Button
                sx={editButtonStyle}
                onClick={() => handleOpenEdit(item.name)}
              >
                Edit
              </Button>
            </Box>
          ))}
        </Box>

        {/* Add Item Button */}
        <Button
          sx={addItemButtonStyle}
          onClick={handleOpen}
        >
          Add Item
        </Button>
      </Box>

      {/* Recipe Generator Section */}
      <Box
        border="1px solid #ddd"
        borderRadius={2}
        overflow="hidden"
        boxShadow={3}
        width="100%"
        maxWidth="1200px"
        padding={2}
        marginTop={2}
      >
        <Typography variant="h5" color="white" textAlign="center" marginBottom={2}>
          Generate Recipe from Pantry Items
        </Typography>
      

        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Button
            sx={addButtonStyle}
            onClick={generateRecipe}
          >
            Generate Recipe
          </Button>

          {isGenerating && <LoadingSpinner />}

          {recipe && <RecipeCard recipe={recipe} />}
        </Box>
      </Box>

      {/* Add Item Modal */}
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={modalStyle}>
          <TextField
            label="Item Name"
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Button
            sx={addButtonStyle}
            onClick={() => {
              if (itemName.trim()) {
                addItem(itemName);
                setItemName('');
                handleClose();
              }
            }}
          >
            Add
          </Button>
        </Box>
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        open={openEdit}
        onClose={handleCloseEdit}
      >
        <Box sx={modalStyle}>
          <TextField
            label="Edit Item Name"
            variant="outlined"
            fullWidth
            value={editItemName}
            onChange={(e) => setEditItemName(e.target.value)}
          />
          <Button
            sx={addButtonStyle}
            onClick={handleEditItem}
          >
            Save
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}


